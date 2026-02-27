import { useState, useEffect, type FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPortal } from '../api/portals';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import { uploadFile } from '../api/uploads';
import type { Portal } from '../types/portal';
import type {
  Product,
  CreateProductRequest,
} from '../types/product';
import Spinner from '../components/ui/Spinner';

const CATEGORIES = [
  { value: 'apparel', label: 'Apparel' },
  { value: 'business_cards', label: 'Business Cards' },
  { value: 'signage', label: 'Signage' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'packaging', label: 'Packaging' },
];

export default function ProductManagementPage() {
  const { portalId } = useParams<{ portalId: string }>();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    category: 'apparel',
    description: '',
    sizes: [],
    colors: [],
    pricing_tiers: [],
    mockup_urls: [],
    min_order_qty: 1,
  });

  useEffect(() => {
    if (!portalId) return;
    Promise.all([getPortal(portalId), listProducts(portalId)])
      .then(([p, prods]) => {
        setPortal(p);
        setProducts(prods);
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false));
  }, [portalId]);

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'apparel',
      description: '',
      sizes: [],
      colors: [],
      pricing_tiers: [],
      mockup_urls: [],
      min_order_qty: 1,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      sku: product.sku ?? undefined,
      category: product.category,
      description: product.description ?? '',
      sizes: product.sizes,
      colors: product.colors,
      pricing_tiers: product.pricing_tiers,
      mockup_urls: product.mockup_urls,
      min_order_qty: product.min_order_qty,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!portalId || !formData.name.trim()) return;
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        const updated = await updateProduct(portalId, editingId, formData);
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      } else {
        const created = await createProduct(portalId, formData);
        setProducts((prev) => [...prev, created]);
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!portalId) return;
    try {
      await deleteProduct(portalId, productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch {
      setError('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to={`/portals/${portalId}`} className="text-sm text-indigo-600 hover:text-indigo-800">
          &larr; Back to {portal?.name ?? 'portal'}
        </Link>
        <div className="mt-1 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Products</h2>
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              + Add Product
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {/* Inline Form */}
      {showForm && (
        <InlineProductForm
          data={formData}
          onChange={setFormData}
          onSave={handleSave}
          onCancel={resetForm}
          saving={saving}
          isEditing={!!editingId}
          portalId={portalId!}
        />
      )}

      {/* Product Table */}
      {products.length === 0 && !showForm ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">No products yet. Add your first product.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.mockup_urls.length > 0 ? (
                        <img
                          src={product.mockup_urls[0]}
                          alt=""
                          className="h-10 w-10 rounded border object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded border bg-gray-100" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        {product.sizes.length > 0 && (
                          <p className="text-xs text-gray-500">
                            {product.sizes.map((s) => s.label).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{product.sku ?? '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {CATEGORIES.find((c) => c.value === product.category)?.label ?? product.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-sm text-indigo-600 hover:text-indigo-800 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---- Inline Product Form ---- */

interface InlineFormProps {
  data: CreateProductRequest;
  onChange: (data: CreateProductRequest) => void;
  onSave: (e: FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
  isEditing: boolean;
  portalId: string;
}

function InlineProductForm({ data, onChange, onSave, onCancel, saving, isEditing }: InlineFormProps) {
  const [uploadingMockup, setUploadingMockup] = useState(false);

  const handleMockupUpload = async (file: File) => {
    setUploadingMockup(true);
    try {
      const result = await uploadFile(file);
      onChange({ ...data, mockup_urls: [...(data.mockup_urls ?? []), result.url] });
    } catch {
      // best-effort
    } finally {
      setUploadingMockup(false);
    }
  };

  return (
    <form onSubmit={onSave} className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-gray-900">
        {isEditing ? 'Edit Product' : 'Add Product'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            required
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <select
            value={data.category}
            onChange={(e) => onChange({ ...data, category: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={data.description ?? ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            value={data.sku ?? ''}
            onChange={(e) => onChange({ ...data, sku: e.target.value || undefined })}
            placeholder="Auto"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Qty</label>
          <input
            type="number"
            min={1}
            value={data.min_order_qty ?? 1}
            onChange={(e) => onChange({ ...data, min_order_qty: parseInt(e.target.value) || 1 })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mockup</label>
          <input
            type="file"
            accept="image/*"
            disabled={uploadingMockup}
            onChange={(e) => e.target.files?.[0] && handleMockupUpload(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-2 file:rounded file:border-0 file:bg-indigo-50 file:px-2 file:py-1 file:text-xs file:text-indigo-700"
          />
        </div>
      </div>

      {/* Sizes inline */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Sizes</label>
          <button
            type="button"
            onClick={() =>
              onChange({ ...data, sizes: [...(data.sizes ?? []), { label: '', price_adjustment: 0 }] })
            }
            className="text-xs text-indigo-600"
          >
            + Add
          </button>
        </div>
        {(data.sizes ?? []).map((s, i) => (
          <div key={i} className="mt-1 flex gap-2 items-center">
            <input
              type="text"
              value={s.label}
              onChange={(e) => {
                const sizes = [...(data.sizes ?? [])];
                sizes[i] = { ...sizes[i], label: e.target.value };
                onChange({ ...data, sizes });
              }}
              placeholder="Size"
              className="w-1/2 rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
            <input
              type="number"
              step="0.01"
              value={s.price_adjustment}
              onChange={(e) => {
                const sizes = [...(data.sizes ?? [])];
                sizes[i] = { ...sizes[i], price_adjustment: parseFloat(e.target.value) || 0 };
                onChange({ ...data, sizes });
              }}
              placeholder="+$"
              className="w-1/3 rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() => onChange({ ...data, sizes: (data.sizes ?? []).filter((_, j) => j !== i) })}
              className="text-red-500 text-xs"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Pricing tiers inline */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Pricing</label>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                pricing_tiers: [...(data.pricing_tiers ?? []), { min_qty: 1, max_qty: null, unit_price: 0 }],
              })
            }
            className="text-xs text-indigo-600"
          >
            + Add
          </button>
        </div>
        {(data.pricing_tiers ?? []).map((t, i) => (
          <div key={i} className="mt-1 flex gap-2 items-center">
            <input
              type="number"
              min={1}
              value={t.min_qty}
              onChange={(e) => {
                const tiers = [...(data.pricing_tiers ?? [])];
                tiers[i] = { ...tiers[i], min_qty: parseInt(e.target.value) || 1 };
                onChange({ ...data, pricing_tiers: tiers });
              }}
              placeholder="Min"
              className="w-1/4 rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
            <span className="text-xs text-gray-400">-</span>
            <input
              type="number"
              value={t.max_qty ?? ''}
              onChange={(e) => {
                const tiers = [...(data.pricing_tiers ?? [])];
                tiers[i] = { ...tiers[i], max_qty: e.target.value ? parseInt(e.target.value) : null };
                onChange({ ...data, pricing_tiers: tiers });
              }}
              placeholder="Max"
              className="w-1/4 rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
            <span className="text-xs text-gray-400">@</span>
            <input
              type="number"
              step="0.01"
              value={t.unit_price}
              onChange={(e) => {
                const tiers = [...(data.pricing_tiers ?? [])];
                tiers[i] = { ...tiers[i], unit_price: parseFloat(e.target.value) || 0 };
                onChange({ ...data, pricing_tiers: tiers });
              }}
              placeholder="$/ea"
              className="w-1/4 rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={() =>
                onChange({ ...data, pricing_tiers: (data.pricing_tiers ?? []).filter((_, j) => j !== i) })
              }
              className="text-red-500 text-xs"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 border-t pt-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || !data.name.trim()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEditing ? 'Update' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}
