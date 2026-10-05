import { useState } from 'react';
import { confirmProductPrice, updateProduct } from '../../api/products';
import type { PriceOption, PriceOptionInput, Product } from '../../types/product';

/**
 * Outsourced-product pricing in the admin grid (S87): RGI states markup as a
 * multiplier on the vendor quote, keeps the hotel's price stable, and is told
 * when cost erosion takes the markup below its floor. Nothing here re-prices
 * automatically: "Keep price" records the decision, editing the price raises it.
 */

const times = (value: string | number | null | undefined) =>
  value == null || value === '' ? '—' : `${Number(value).toFixed(2)}×`;

/** The markup the published price gives today, against its floor. */
export function MarkupBadge({
  effective,
  floor,
  belowFloor,
  pending,
}: {
  effective?: string | null;
  floor?: string | null;
  belowFloor?: boolean;
  pending?: boolean;
}) {
  return (
    <span className="inline-flex flex-col">
      <span className={belowFloor ? 'font-semibold text-red-700' : 'text-gray-900'}>
        {times(effective)}
      </span>
      {floor != null && <span className="text-xs text-gray-500">floor {times(floor)}</span>}
      {pending && (
        <span className="mt-0.5 inline-flex w-fit rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-800">
          Below floor — decide
        </span>
      )}
      {belowFloor && !pending && (
        <span className="mt-0.5 text-xs text-gray-500">below floor, price kept</span>
      )}
    </span>
  );
}

/** "Keep price": RGI's answer to a floor alert, or a plain re-confirmation. */
export function KeepPriceButton({
  portalId,
  product,
  optionLabel,
  onUpdated,
}: {
  portalId: string;
  product: Product;
  optionLabel?: string;
  onUpdated: (product: Product) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          onUpdated(await confirmProductPrice(portalId, product.id, optionLabel));
        } catch {
          alert('Could not confirm the price');
        } finally {
          setBusy(false);
        }
      }}
      className="text-sm text-teak-dark hover:text-teak disabled:opacity-50"
      title="Keep the hotel's price as it is and record today as its confirmed date"
    >
      Keep price
    </button>
  );
}

const toInput = (option: PriceOption): PriceOptionInput => ({
  label: option.label,
  price: Number(option.price),
  cost: option.cost == null ? null : Number(option.cost),
  floor_multiplier: option.floor_multiplier == null ? null : Number(option.floor_multiplier),
});

/** Edit a product's buyer-picked options, each with its own cost and price. */
export function PriceOptionsEditor({
  portalId,
  product,
  onClose,
  onUpdated,
}: {
  portalId: string;
  product: Product;
  onClose: () => void;
  onUpdated: (product: Product) => void;
}) {
  const [setName, setSetName] = useState(product.option_set_name ?? '');
  const [rows, setRows] = useState<PriceOptionInput[]>((product.price_options ?? []).map(toInput));
  const [saving, setSaving] = useState(false);
  const saved = new Map((product.price_options ?? []).map((o) => [o.label, o]));

  const update = (index: number, patch: Partial<PriceOptionInput>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  return (
    <div role="dialog" aria-label="Price options" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">Options for {product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          Each option has its own vendor cost and published price per pack. The buyer must pick one;
          they see the label and price only.
        </p>
        <label className="mt-4 block text-sm font-medium text-gray-700">
          Option name
          <input
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            placeholder="e.g. Locking system"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </label>
        <table className="mt-4 min-w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-gray-500">
              <th className="py-1">Label</th>
              <th className="py-1">Cost</th>
              <th className="py-1">Price / pack</th>
              <th className="py-1">Floor ×</th>
              <th className="py-1">Markup</th>
              <th className="py-1" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const current = saved.get(row.label);
              return (
                <tr key={i}>
                  <td className="py-1 pr-2">
                    <input aria-label="Label" value={row.label} onChange={(e) => update(i, { label: e.target.value })} className="w-36 rounded border border-gray-300 px-2 py-1" />
                  </td>
                  <td className="py-1 pr-2">
                    <input aria-label="Cost" type="number" step="0.01" value={row.cost ?? ''} onChange={(e) => update(i, { cost: e.target.value === '' ? null : parseFloat(e.target.value) })} className="w-24 rounded border border-gray-300 px-2 py-1" />
                  </td>
                  <td className="py-1 pr-2">
                    <input aria-label="Price" type="number" step="0.01" value={row.price} onChange={(e) => update(i, { price: parseFloat(e.target.value) || 0 })} className="w-24 rounded border border-gray-300 px-2 py-1" />
                  </td>
                  <td className="py-1 pr-2">
                    <input aria-label="Floor" type="number" step="0.01" value={row.floor_multiplier ?? ''} placeholder={product.floor_multiplier ? Number(product.floor_multiplier).toFixed(2) : ''} onChange={(e) => update(i, { floor_multiplier: e.target.value === '' ? null : parseFloat(e.target.value) })} className="w-20 rounded border border-gray-300 px-2 py-1" />
                  </td>
                  <td className="py-1 pr-2">
                    {current && (
                      <MarkupBadge effective={current.effective_multiplier} belowFloor={current.below_floor} pending={current.floor_alert_pending} />
                    )}
                  </td>
                  <td className="py-1 text-right">
                    {current?.floor_alert_pending && (
                      <KeepPriceButton portalId={portalId} product={product} optionLabel={current.label} onUpdated={onUpdated} />
                    )}{' '}
                    <button type="button" onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))} className="text-sm text-red-600 hover:text-red-800">
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button type="button" onClick={() => setRows((prev) => [...prev, { label: '', price: 0, cost: null, floor_multiplier: null }])} className="mt-2 text-sm text-teak-dark hover:text-teak">
          + Add option
        </button>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border border-gray-300 px-3 py-1.5 text-sm">
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || rows.some((r) => !r.label.trim())}
            onClick={async () => {
              setSaving(true);
              try {
                onUpdated(
                  await updateProduct(portalId, product.id, {
                    option_set_name: setName.trim() || null,
                    price_options: rows,
                  }),
                );
                onClose();
              } catch {
                alert('Could not save the options');
              } finally {
                setSaving(false);
              }
            }}
            className="rounded bg-teak px-3 py-1.5 text-sm text-white disabled:opacity-50"
          >
            Save options
          </button>
        </div>
      </div>
    </div>
  );
}
