// Phase 1 (plan §5.5): every portal is invoice terms. The buyer is never shown a
// freight charge, because the printer ships on its own carrier account and bills
// actual freight on the invoice (buyer-journey item 3, 2026-09-25).
export const INVOICE_TERMS = true;

const INVOICE_METHODS = new Set(['invoice', 'invoice_later']);

export function isInvoiceOrder(paymentMethod: string | null | undefined): boolean {
  return paymentMethod != null && INVOICE_METHODS.has(paymentMethod);
}

export const FREIGHT_NOTE = 'Billed at cost on your invoice';
