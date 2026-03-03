import { useState, type FormEvent } from 'react';
import { uploadFile } from '../../api/uploads';
import SpreadsheetImport from './SpreadsheetImport';
import type {
  CreateProductRequest,
  SizeOption,
  ColorOption,
  PricingTier,
} from '../../types/product';

const CATEGORIES = [
  { value: 'apparel', label: 'Apparel' },
  { value: 'business_cards', label: 'Business Cards' },
  { value: 'signage', label: 'Signage' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'packaging', label: 'Packaging' },
];

export interface WizardProduct extends CreateProductRequest {
  _tempId: string;
}

interface Props {
  products: WizardProduct[];
  onUpdate: (products: WizardProduct[]) => void;
  onNext: () => void;
  onBack: () => void;
}

function emptyProduct(): WizardProduct {
  return {
    _tempId: crypto.randomUUID(),
    name: '',
    category: 'apparel',
    description: '',
    sizes: [],
    colors: [],
    pricing_tiers: [],
    mockup_urls: [],
    min_order_qty: 1,
  };
}

export default function ProductAddStep({ products, onUpdate, onNext, onBack }: Props) {
  const [editing, setEditing] = useState<WizardProduct | null>(null);
  const [showForm, setShowForm] = useState(products.length === 0);
  const [showImport, setShowImport] = useState(false);

  const handleAddNew = () => {
    setEditing(emptyProduct());
    setShowForm(true);
  };

  const handleEditProduct = (product: WizardProduct) => {
    setEditing({ ...product });
    setShowForm(true);
  };

  const handleSaveProduct = () => {
    if (!editing || !editing.name.trim()) return;
    const exists = products.find((p) => p._tempId === editing._tempId);
    if (exists) {
      onUpdate(products.map((p) => (p._tempId === editing._tempId ? editing : p)));
    } else {
      onUpdate([...products, editing]);
    }
    setEditing(null);
    setShowForm(false);
  };

  const handleRemoveProduct = (tempId: string) => {
    onUpdate(products.filter((p) => p._tempId !== tempId));
  };

  const handleCancel = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleCsvImport = (imported: WizardProduct[]) => {
    onUpdate([...products, ...imported]);
    setShowImport(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Add Products</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add the products your client can order through this portal.
        </p>
      </div>

      {/* Product List */}
      {products.length > 0 && !showForm && (
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product._tempId}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {CATEGORIES.find((c) => c.value === product.category)?.label ?? product.category}
                  {product.sizes && product.sizes.length > 0 && ` \u00B7 ${product.sizes.length} sizes`}
                  {product.colors && product.colors.length > 0 && ` \u00B7 ${product.colors.length} colors`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEditProduct(product)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(product._tempId)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form */}
      {showForm && editing && (
        <ProductForm
          product={editing}
          onChange={setEditing}
          onSave={handleSaveProduct}
          onCancel={handleCancel}
        />
      )}

      {/* CSV Import Modal */}
      {showImport && (
        <SpreadsheetImport
          onImport={handleCsvImport}
          onCancel={() => setShowImport(false)}
        />
      )}

      {/* Actions */}
      {!showForm && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-1 rounded-md border border-dashed border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
            >
              + Add Product
            </button>
            <button
              type="button"
              onClick={() => setShowImport(true)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Import from CSV
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={products.length === 0}
                className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ---------- Inline Product Form ---------- */

interface ProductFormProps {
  product: WizardProduct;
  onChange: (product: WizardProduct) => void;
  onSave: () => void;
  onCancel: () => void;
}

function ProductForm({ product, onChange, onSave, onCancel }: ProductFormProps) {
  const [uploadingMockup, setUploadingMockup] = useState(false);

  const handleMockupUpload = async (file: File) => {
    setUploadingMockup(true);
    try {
      const result = await uploadFile(file);
      onChange({
        ...product,
        mockup_urls: [...(product.mockup_urls ?? []), result.url],
      });
    } catch {
      // best-effort
    } finally {
      setUploadingMockup(false);
    }
  };

  // Size helpers
  const addSize = () => {
    onChange({
      ...product,
      sizes: [...(product.sizes ?? []), { label: '', price_adjustment: 0 }],
    });
  };

  const updateSize = (index: number, partial: Partial<SizeOption>) => {
    const sizes = [...(product.sizes ?? [])];
    sizes[index] = { ...sizes[index], ...partial };
    onChange({ ...product, sizes });
  };

  const removeSize = (index: number) => {
    onChange({ ...product, sizes: (product.sizes ?? []).filter((_, i) => i !== index) });
  };

  // Color helpers
  const addColor = () => {
    onChange({
      ...product,
      colors: [...(product.colors ?? []), { name: '', hex_code: '', image_url: null }],
    });
  };

  const updateColor = (index: number, partial: Partial<ColorOption>) => {
    const colors = [...(product.colors ?? [])];
    colors[index] = { ...colors[index], ...partial };
    onChange({ ...product, colors });
  };

  const removeColor = (index: number) => {
    onChange({ ...product, colors: (product.colors ?? []).filter((_, i) => i !== index) });
  };

  // Pricing tier helpers
  const addTier = () => {
    onChange({
      ...product,
      pricing_tiers: [...(product.pricing_tiers ?? []), { min_qty: 1, max_qty: null, unit_price: 0 }],
    });
  };

  const updateTier = (index: number, partial: Partial<PricingTier>) => {
    const tiers = [...(product.pricing_tiers ?? [])];
    tiers[index] = { ...tiers[index], ...partial };
    onChange({ ...product, pricing_tiers: tiers });
  };

  const removeTier = (index: number) => {
    onChange({ ...product, pricing_tiers: (product.pricing_tiers ?? []).filter((_, i) => i !== index) });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-gray-200 p-4">
      {/* Name & Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={product.name}
            onChange={(e) => onChange({ ...product, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={product.category}
            onChange={(e) => onChange({ ...product, category: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={product.description ?? ''}
          onChange={(e) => onChange({ ...product, description: e.target.value })}
          rows={2}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {/* SKU & Min Order Qty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            value={product.sku ?? ''}
            onChange={(e) => onChange({ ...product, sku: e.target.value || undefined })}
            placeholder="Auto-generated if empty"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Order Qty</label>
          <input
            type="number"
            min={1}
            value={product.min_order_qty ?? 1}
            onChange={(e) => onChange({ ...product, min_order_qty: parseInt(e.target.value) || 1 })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Sizes */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Sizes</label>
          <button type="button" onClick={addSize} className="text-xs text-indigo-600 hover:text-indigo-800">
            + Add Size
          </button>
        </div>
        {(product.sizes ?? []).map((size, i) => (
          <div key={i} className="mt-1 flex items-center gap-2">
            <input
              type="text"
              value={size.label}
              onChange={(e) => updateSize(i, { label: e.target.value })}
              placeholder="e.g., XL"
              className="block w-1/2 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <input
              type="number"
              step="0.01"
              value={size.price_adjustment}
              onChange={(e) => updateSize(i, { price_adjustment: parseFloat(e.target.value) || 0 })}
              placeholder="Price adj."
              className="block w-1/3 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <button type="button" onClick={() => removeSize(i)} className="text-xs text-red-500 hover:text-red-700">
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Colors */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Colors</label>
          <button type="button" onClick={addColor} className="text-xs text-indigo-600 hover:text-indigo-800">
            + Add Color
          </button>
        </div>
        {(product.colors ?? []).map((color, i) => (
          <div key={i} className="mt-1 flex items-center gap-2">
            <input
              type="text"
              value={color.name}
              onChange={(e) => updateColor(i, { name: e.target.value })}
              placeholder="Color name"
              className="block w-1/3 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <input
              type="color"
              value={color.hex_code || '#000000'}
              onChange={(e) => updateColor(i, { hex_code: e.target.value })}
              className="h-7 w-7 cursor-pointer rounded border border-gray-300"
            />
            <input
              type="text"
              value={color.hex_code ?? ''}
              onChange={(e) => updateColor(i, { hex_code: e.target.value })}
              placeholder="#hex"
              className="block w-1/4 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <button type="button" onClick={() => removeColor(i)} className="text-xs text-red-500 hover:text-red-700">
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Pricing Tiers */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Pricing Tiers</label>
          <button type="button" onClick={addTier} className="text-xs text-indigo-600 hover:text-indigo-800">
            + Add Tier
          </button>
        </div>
        {(product.pricing_tiers ?? []).map((tier, i) => (
          <div key={i} className="mt-1 flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={tier.min_qty}
              onChange={(e) => updateTier(i, { min_qty: parseInt(e.target.value) || 1 })}
              placeholder="Min"
              className="block w-1/4 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="number"
              min={1}
              value={tier.max_qty ?? ''}
              onChange={(e) => updateTier(i, { max_qty: e.target.value ? parseInt(e.target.value) : null })}
              placeholder="Max (∞)"
              className="block w-1/4 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <span className="text-xs text-gray-400">@</span>
            <input
              type="number"
              step="0.01"
              min={0}
              value={tier.unit_price}
              onChange={(e) => updateTier(i, { unit_price: parseFloat(e.target.value) || 0 })}
              placeholder="$/unit"
              className="block w-1/4 rounded-md border border-gray-300 px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
            <button type="button" onClick={() => removeTier(i)} className="text-xs text-red-500 hover:text-red-700">
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Mockup Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Mockup Images</label>
        {(product.mockup_urls ?? []).length > 0 && (
          <div className="mt-1 flex gap-2 flex-wrap">
            {(product.mockup_urls ?? []).map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="" className="h-16 w-16 rounded border object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...product, mockup_urls: (product.mockup_urls ?? []).filter((_, j) => j !== i) })
                  }
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          disabled={uploadingMockup}
          onChange={(e) => e.target.files?.[0] && handleMockupUpload(e.target.files[0])}
          className="mt-1 block text-sm text-gray-500 file:mr-4 file:rounded file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>

      {/* Save / Cancel */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!product.name.trim()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Save Product
        </button>
      </div>
    </form>
  );
}
