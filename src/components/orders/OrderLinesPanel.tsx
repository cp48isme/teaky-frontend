import type { Order } from "../../types/order";
import AuthedDownloadLink from '../ui/AuthedDownloadLink';
import { recipientText } from "../../lib/recipientText";
import { staffArtworkLine } from "../../lib/artworkCopy";

interface Props {
  order: Order;
}

/** Line items and the totals (the split, review 19 Nov 2026, item 12). */
export default function OrderLinesPanel({ order }: Props) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-medium text-gray-900">Line Items</h3>
      <div className="mt-3 space-y-3">
        {order.line_items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-3 last:border-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {item.product_name}
              </p>
              <p className="text-xs text-gray-500">
                {item.product_sku && `SKU: ${item.product_sku} | `}
                Qty: {item.quantity}
                {item.size && ` | Size: ${item.size}`}
                {item.color && ` | Color: ${item.color}`}
              </p>
              {item.recipients && item.recipients.length > 0 && (
                <p className="text-xs text-gray-700">
                  For: {item.recipients.map(recipientText).join("; ")}
                </p>
              )}
              <p
                className={`mt-1 text-xs font-medium ${
                  item.artwork_disposition === "changes_new_proof"
                    ? "text-amber-700"
                    : "text-gray-700"
                }`}
              >
                {staffArtworkLine(item)}
              </p>
              {item.artwork_change_note && (
                <p className="text-xs text-gray-700">
                  Changes: {item.artwork_change_note}
                </p>
              )}
              {item.artwork_upload_url && (
                <AuthedDownloadLink
                  href={item.artwork_upload_url}
                  className="text-xs text-teak-dark hover:text-teak"
                >
                  New art uploaded by the buyer
                </AuthedDownloadLink>
              )}
              {item.needs_proof && (
                <span
                  className={`mt-1 inline-block text-xs font-medium ${
                    item.proof_status === "approved"
                      ? "text-green-600"
                      : item.proof_status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  Proof: {item.proof_status || "needed"}
                </span>
              )}
            </div>
            <p className="text-sm font-medium">
              {item.line_total == null || item.unpriced
                ? "unpriced"
                : `$${Number(item.line_total).toFixed(2)}`}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t pt-3 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>
            Subtotal
            {(order.unpriced_lines ?? 0) > 0 && (
              <span className="ml-2 text-xs text-amber-700">
                excludes {order.unpriced_lines} unpriced line
                {order.unpriced_lines === 1 ? "" : "s"}
              </span>
            )}
          </span>
          <span>${Number(order.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>${Number(order.shipping_cost).toFixed(2)}</span>
        </div>
        {Number(order.tax_amount) > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${Number(order.tax_amount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
