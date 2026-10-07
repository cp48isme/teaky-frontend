import { useEffect, useState } from 'react';
import { getOrderCosts, updateLineItemCosts, updateOrderCosts } from '../../api/orderCosts';
import type { LineItemCosts, OrderCosts } from '../../types/orderCosts';

interface Props {
  orderId: string;
  /** The order's subtotal (price to the hotel), for the gross-profit line. */
  subtotal: number;
}

const money = (v: number | null | undefined) =>
  v == null ? '—' : `$${Number(v).toFixed(2)}`;

function parseMoney(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === '') return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

/**
 * Printer-side gross-profit capture for one order (plan §5.3): the cost basis
 * each line was placed with, the manual charges staff fill when the supplier
 * invoice arrives, and the order-level freight, fee and invoice month. Never
 * shown to a buyer; the API refuses buyer-side roles.
 */
export default function OrderCostsPanel({ orderId, subtotal }: Props) {
  const [costs, setCosts] = useState<OrderCosts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [freight, setFreight] = useState('');
  const [fee, setFee] = useState('');
  const [feeSource, setFeeSource] = useState('');
  const [invoiceMonth, setInvoiceMonth] = useState('');
  const [lineDrafts, setLineDrafts] = useState<
    Record<string, { unit_cost: string; cost_source: string; decoration_charge: string; inbound_freight_allocation: string }>
  >({});

  const load = (c: OrderCosts) => {
    setCosts(c);
    setFreight(c.outbound_freight_cost == null ? '' : String(c.outbound_freight_cost));
    setFee(c.processing_fee_actual == null ? '' : String(c.processing_fee_actual));
    setFeeSource(c.processing_fee_source ?? '');
    setInvoiceMonth(c.invoice_month ?? '');
    setLineDrafts(
      Object.fromEntries(
        c.lines.map((l) => [
          l.line_item_id,
          {
            unit_cost: l.unit_cost == null ? '' : String(l.unit_cost),
            cost_source: l.cost_source ?? '',
            decoration_charge: l.decoration_charge == null ? '' : String(l.decoration_charge),
            inbound_freight_allocation:
              l.inbound_freight_allocation == null ? '' : String(l.inbound_freight_allocation),
          },
        ]),
      ),
    );
  };

  useEffect(() => {
    getOrderCosts(orderId)
      .then(load)
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load costs'));
  }, [orderId]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!costs) return null;

  const cogs = costs.lines.reduce(
    (sum, l) =>
      sum +
      (l.unit_cost ?? 0) * l.quantity +
      (l.decoration_charge ?? 0) +
      (l.inbound_freight_allocation ?? 0),
    0,
  );
  const costed = costs.lines.every((l) => l.unit_cost != null);
  const grossProfit = subtotal - cogs - (costs.outbound_freight_cost ?? 0);

  const saveOrder = async () => {
    setSaving('order');
    setError(null);
    try {
      load(
        await updateOrderCosts(orderId, {
          ...(parseMoney(freight) !== undefined ? { outbound_freight_cost: parseMoney(freight) } : {}),
          ...(parseMoney(fee) !== undefined ? { processing_fee_actual: parseMoney(fee) } : {}),
          ...(feeSource.trim() ? { processing_fee_source: feeSource.trim() } : {}),
          ...(invoiceMonth ? { invoice_month: invoiceMonth } : {}),
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(null);
    }
  };

  const saveLine = async (line: LineItemCosts) => {
    const d = lineDrafts[line.line_item_id];
    setSaving(line.line_item_id);
    setError(null);
    try {
      load(
        await updateLineItemCosts(orderId, line.line_item_id, {
          ...(parseMoney(d.unit_cost) !== undefined ? { unit_cost: parseMoney(d.unit_cost) } : {}),
          ...(d.cost_source.trim() ? { cost_source: d.cost_source.trim() } : {}),
          ...(parseMoney(d.decoration_charge) !== undefined
            ? { decoration_charge: parseMoney(d.decoration_charge) }
            : {}),
          ...(parseMoney(d.inbound_freight_allocation) !== undefined
            ? { inbound_freight_allocation: parseMoney(d.inbound_freight_allocation) }
            : {}),
        }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save');
    } finally {
      setSaving(null);
    }
  };

  const input = 'mt-1 block w-full rounded border border-gray-300 px-2 py-1 text-sm';

  return (
    <section className="rounded-lg border bg-white p-4" aria-labelledby="costs-heading">
      <div className="flex items-baseline justify-between">
        <h3 id="costs-heading" className="font-medium text-gray-900">
          Costs and gross profit
        </h3>
        <p className="text-sm text-gray-600">
          Price {money(subtotal)} · Cost of goods {money(cogs)}
          {costs.outbound_freight_cost != null && ` · Freight ${money(costs.outbound_freight_cost)}`}
          {' · '}
          <span className={costed ? 'font-medium text-gray-900' : 'text-yellow-700'}>
            GP {money(grossProfit)}
            {!costed && ' (a line has no cost yet)'}
          </span>
          {costs.revenue_share_rate_snapshot != null &&
            ` · share rate ${(Number(costs.revenue_share_rate_snapshot) * 100).toFixed(0)}%`}
        </p>
      </div>

      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
            <th className="py-1">Line</th>
            <th className="py-1">Price / pack</th>
            <th className="py-1">Cost / pack</th>
            <th className="py-1">Cost source</th>
            <th className="py-1">Decoration</th>
            <th className="py-1">Inbound freight</th>
            <th className="py-1"></th>
          </tr>
        </thead>
        <tbody>
          {costs.lines.map((line) => {
            const d = lineDrafts[line.line_item_id];
            return (
              <tr key={line.line_item_id} className="border-t align-top">
                <td className="py-2 pr-2">
                  <div className="font-medium text-gray-900">{line.product_name}</div>
                  <div className="text-xs text-gray-500">
                    {line.quantity} × pack of {line.pack_size.toLocaleString('en-US')}
                  </div>
                </td>
                <td className="py-2 pr-2">{money(line.unit_price)}</td>
                <td className="py-2 pr-2">
                  <input
                    aria-label={`${line.product_name} cost per pack`}
                    className={input}
                    inputMode="decimal"
                    value={d.unit_cost}
                    onChange={(e) =>
                      setLineDrafts({ ...lineDrafts, [line.line_item_id]: { ...d, unit_cost: e.target.value } })
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    aria-label={`${line.product_name} cost source`}
                    className={input}
                    value={d.cost_source}
                    onChange={(e) =>
                      setLineDrafts({ ...lineDrafts, [line.line_item_id]: { ...d, cost_source: e.target.value } })
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    aria-label={`${line.product_name} decoration charge`}
                    className={input}
                    inputMode="decimal"
                    value={d.decoration_charge}
                    onChange={(e) =>
                      setLineDrafts({
                        ...lineDrafts,
                        [line.line_item_id]: { ...d, decoration_charge: e.target.value },
                      })
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    aria-label={`${line.product_name} inbound freight`}
                    className={input}
                    inputMode="decimal"
                    value={d.inbound_freight_allocation}
                    onChange={(e) =>
                      setLineDrafts({
                        ...lineDrafts,
                        [line.line_item_id]: { ...d, inbound_freight_allocation: e.target.value },
                      })
                    }
                  />
                </td>
                <td className="py-2">
                  <button
                    onClick={() => saveLine(line)}
                    disabled={saving !== null}
                    className="rounded border px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {saving === line.line_item_id ? 'Saving…' : 'Save line'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        <label className="text-xs font-medium text-gray-500">
          Outbound freight (label cost)
          <input className={input} inputMode="decimal" value={freight} onChange={(e) => setFreight(e.target.value)} />
        </label>
        <label className="text-xs font-medium text-gray-500">
          Processing fee
          <input className={input} inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} />
        </label>
        <label className="text-xs font-medium text-gray-500">
          Fee source
          <input className={input} value={feeSource} onChange={(e) => setFeeSource(e.target.value)} placeholder="manual" />
        </label>
        <label className="text-xs font-medium text-gray-500">
          Invoice month
          <input
            className={input}
            type="date"
            value={invoiceMonth}
            onChange={(e) => setInvoiceMonth(e.target.value)}
          />
          <span className="font-normal text-gray-400">
            {costs.invoice_month ? '' : 'Set to the ship month when the order ships.'}
          </span>
        </label>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={saveOrder}
          disabled={saving !== null}
          className="rounded-md bg-teak-dark px-3 py-1.5 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
        >
          {saving === 'order' ? 'Saving…' : 'Save order costs'}
        </button>
        <span className="text-xs text-gray-500">
          Costs are the printer's own. Buyers never see this panel.
        </span>
      </div>
    </section>
  );
}
