import type { TopProduct } from '../../types/analytics';

interface Props {
  byRevenue: TopProduct[];
  byQuantity: TopProduct[];
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function ProductTable({ title, products }: { title: string; products: TopProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">{title}</h3>
        <p className="text-sm text-gray-500">No product data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{title}</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
            <th className="pb-2">Product</th>
            <th className="pb-2">SKU</th>
            <th className="pb-2 text-right">Qty</th>
            <th className="pb-2 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={`${p.product_id}-${i}`} className="border-b border-gray-50">
              <td className="py-2 font-medium text-gray-900">{p.product_name}</td>
              <td className="py-2 text-gray-500">{p.product_sku || '-'}</td>
              <td className="py-2 text-right text-gray-700">{p.total_quantity.toLocaleString()}</td>
              <td className="py-2 text-right text-gray-700">{formatCurrency(p.total_revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TopProductsTable({ byRevenue, byQuantity }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ProductTable title="Top Products by Revenue" products={byRevenue} />
      <ProductTable title="Top Products by Quantity" products={byQuantity} />
    </div>
  );
}
