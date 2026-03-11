import { useState, useEffect, type ChangeEvent } from 'react';
import { listProducts, createProduct, updateProduct, deleteProduct } from '../../api/products';
import { createProductsFromDescription } from '../../api/portals';
import { uploadFile } from '../../api/uploads';
import type { Product, CreateProductRequest } from '../../types/product';
import Spinner from '../ui/Spinner';

const CATEGORIES = [
  { value: 'apparel', label: 'Apparel' },
  { value: 'business_cards', label: 'Business Cards' },
  { value: 'signage', label: 'Signage' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'packaging', label: 'Packaging' },
];

interface Props {
  portalId: string;
  onProductsChange?: (products: Product[]) => void;
}

interface EditingCell {
  productId: string;
  field: 'name' | 'category' | 'base_price' | 'status';
  value: string | number;
}

export default function ProductManagementGrid({ portalId, onProductsChange }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'base_price' | 'status'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [showAIInput, setShowAIInput] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCreating, setAiCreating] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(false);

  // Load products
  useEffect(() => {
    loadProducts();
  }, [portalId]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const prods = await listProducts(portalId);
      setProducts(prods);
      onProductsChange?.(prods);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  // Bulk select handlers
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  // Inline editing handlers
  const startEdit = (productId: string, field: EditingCell['field'], currentValue: string | number) => {
    setEditingCell({ productId, field, value: currentValue });
  };

  const saveEdit = async () => {
    if (!editingCell) return;
    const product = products.find((p) => p.id === editingCell.productId);
    if (!product) return;

    try {
      const updateData: Partial<CreateProductRequest> = {
        [editingCell.field]: editingCell.field === 'base_price'
          ? parseFloat(editingCell.value as string)
          : editingCell.value,
      };

      const updated = await updateProduct(portalId, product.id, updateData);
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      onProductsChange?.(products.map((p) => (p.id === updated.id ? updated : p)));
      setEditingCell(null);
    } catch {
      setEditingCell(null);
    }
  };

  const cancelEdit = () => {
    setEditingCell(null);
  };

  // Bulk actions
  const bulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} product(s)?`)) return;

    try {
      await Promise.all(Array.from(selectedIds).map((id) => deleteProduct(portalId, id)));
      setProducts((prev) => prev.filter((p) => !selectedIds.has(p.id)));
      setSelectedIds(new Set());
      onProductsChange?.(products.filter((p) => !selectedIds.has(p.id)));
    } catch {
      alert('Failed to delete some products');
    }
  };

  const bulkChangeCategory = async () => {
    if (selectedIds.size === 0) return;
    const newCategory = prompt('Enter new category:', 'apparel');
    if (!newCategory) return;

    try {
      const updates = Array.from(selectedIds).map((id) =>
        updateProduct(portalId, id, { category: newCategory })
      );
      const updated = await Promise.all(updates);
      setProducts((prev) =>
        prev.map((p) => {
          const match = updated.find((u) => u.id === p.id);
          return match || p;
        })
      );
      setSelectedIds(new Set());
      onProductsChange?.(products);
    } catch {
      alert('Failed to update some products');
    }
  };

  const bulkChangePrice = async () => {
    if (selectedIds.size === 0) return;
    const priceStr = prompt('Enter new base price:');
    if (!priceStr) return;
    const newPrice = parseFloat(priceStr);
    if (isNaN(newPrice)) return;

    try {
      const updates = Array.from(selectedIds).map((id) =>
        updateProduct(portalId, id, { base_price: newPrice })
      );
      const updated = await Promise.all(updates);
      setProducts((prev) =>
        prev.map((p) => {
          const match = updated.find((u) => u.id === p.id);
          return match || p;
        })
      );
      setSelectedIds(new Set());
      onProductsChange?.(products);
    } catch {
      alert('Failed to update some products');
    }
  };

  // AI product creation
  const handleAICreate = async () => {
    if (!aiPrompt.trim()) return;
    setAiCreating(true);
    try {
      await createProductsFromDescription(portalId, aiPrompt);
      await loadProducts();
      setAiPrompt('');
      setShowAIInput(false);
    } catch {
      alert('Failed to create products from AI');
    } finally {
      setAiCreating(false);
    }
  };

  // File upload handler
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      // For now, just upload the file - backend will handle processing
      // In future, we'll have endpoints for CSV/PDF/image processing
      await uploadFile(file);
      alert('File uploaded! Processing will be implemented soon.');
    } catch {
      alert('Failed to upload file');
    } finally {
      setUploadingFile(false);
      e.target.value = ''; // Reset input
    }
  };

  // Add new blank row
  const addBlankRow = async () => {
    try {
      const newProduct = await createProduct(portalId, {
        name: 'New Product',
        category: 'apparel',
        description: '',
        sizes: [],
        colors: [],
        pricing_tiers: [],
        mockup_urls: [],
        min_order_qty: 1,
      });
      setProducts((prev) => [newProduct, ...prev]);
      onProductsChange?.([newProduct, ...products]);
    } catch {
      alert('Failed to create product');
    }
  };

  // Sorting
  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  // Filter and sort
  const filteredProducts = products
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let aVal: string | number | null = a[sortBy] ?? '';
      let bVal: string | number | null = b[sortBy] ?? '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (aStr < bStr) return sortAsc ? -1 : 1;
      if (aStr > bStr) return sortAsc ? 1 : -1;
      return 0;
    });

  // Group by category if enabled
  const groupedProducts: Record<string, Product[]> = {};
  if (groupByCategory) {
    filteredProducts.forEach((p) => {
      const cat = p.category || 'Uncategorized';
      if (!groupedProducts[cat]) groupedProducts[cat] = [];
      groupedProducts[cat].push(p);
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:outline-none focus:ring-teak"
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={addBlankRow}
            className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak"
          >
            + Add Product
          </button>

          <label className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            {uploadingFile ? 'Uploading...' : 'Import from File'}
            <input
              type="file"
              accept=".csv,.xlsx,.pdf,image/*"
              onChange={handleFileUpload}
              disabled={uploadingFile}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowAIInput(true)}
            className="rounded-md border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100"
          >
            Ask AI to Add Products
          </button>

          <button
            onClick={() => alert('Master Catalog Browser coming soon!')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Browse Master Catalog
          </button>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={groupByCategory}
              onChange={(e) => setGroupByCategory(e.target.checked)}
              className="rounded border-gray-300 text-teak focus:ring-teak"
            />
            Group by category
          </label>
        </div>
      </div>

      {/* AI Input */}
      {showAIInput && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
          <h3 className="text-sm font-semibold text-purple-900">Describe products to add</h3>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g., Add polo shirts in navy, red, and white with sizes S-3XL priced at $25 each"
            rows={3}
            className="mt-2 w-full rounded-md border border-purple-200 px-3 py-2 text-sm focus:border-purple-400 focus:outline-none focus:ring-purple-400"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAICreate}
              disabled={aiCreating || !aiPrompt.trim()}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {aiCreating ? 'Creating...' : 'Create Products'}
            </button>
            <button
              onClick={() => {
                setShowAIInput(false);
                setAiPrompt('');
              }}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 border border-blue-200">
          <span className="text-sm font-medium text-blue-900">
            {selectedIds.size} product(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={bulkChangeCategory}
              className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
            >
              Change Category
            </button>
            <button
              onClick={bulkChangePrice}
              className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
            >
              Change Price
            </button>
            <button
              onClick={bulkDelete}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-sm text-gray-500">No products yet. Add your first product.</p>
        </div>
      ) : groupByCategory ? (
        // Grouped view
        <div className="space-y-6">
          {Object.entries(groupedProducts).map(([category, prods]) => (
            <div key={category}>
              <h3 className="mb-2 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {CATEGORIES.find((c) => c.value === category)?.label || category} ({prods.length})
              </h3>
              <ProductTable
                products={prods}
                selectedIds={selectedIds}
                editingCell={editingCell}
                onToggleSelect={toggleSelect}
                onToggleSelectAll={toggleSelectAll}
                onStartEdit={startEdit}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onEditChange={(value) => setEditingCell(editingCell ? { ...editingCell, value } : null)}
                onSort={handleSort}
                sortBy={sortBy}
                sortAsc={sortAsc}
                portalId={portalId}
                onDelete={async (id) => {
                  await deleteProduct(portalId, id);
                  setProducts((prev) => prev.filter((p) => p.id !== id));
                  onProductsChange?.(products.filter((p) => p.id !== id));
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        // Flat view
        <ProductTable
          products={filteredProducts}
          selectedIds={selectedIds}
          editingCell={editingCell}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onStartEdit={startEdit}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onEditChange={(value) => setEditingCell(editingCell ? { ...editingCell, value } : null)}
          onSort={handleSort}
          sortBy={sortBy}
          sortAsc={sortAsc}
          portalId={portalId}
          onDelete={async (id) => {
            await deleteProduct(portalId, id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            onProductsChange?.(products.filter((p) => p.id !== id));
          }}
        />
      )}
    </div>
  );
}

/* ---- Product Table Component ---- */

interface ProductTableProps {
  products: Product[];
  selectedIds: Set<string>;
  editingCell: EditingCell | null;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onStartEdit: (productId: string, field: EditingCell['field'], currentValue: string | number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditChange: (value: string | number) => void;
  onSort: (field: EditingCell['field']) => void;
  sortBy: string;
  sortAsc: boolean;
  portalId: string;
  onDelete: (id: string) => Promise<void>;
}

function ProductTable({
  products,
  selectedIds,
  editingCell,
  onToggleSelect,
  onToggleSelectAll,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
  onSort,
  sortBy,
  sortAsc,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={selectedIds.size === products.length && products.length > 0}
                onChange={onToggleSelectAll}
                className="rounded border-gray-300 text-teak focus:ring-teak"
              />
            </th>
            <th className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Image
            </th>
            <th
              onClick={() => onSort('name')}
              className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
            >
              Name {sortBy === 'name' && (sortAsc ? '↑' : '↓')}
            </th>
            <th
              onClick={() => onSort('category')}
              className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
            >
              Category {sortBy === 'category' && (sortAsc ? '↑' : '↓')}
            </th>
            <th
              onClick={() => onSort('base_price')}
              className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
            >
              Base Price {sortBy === 'base_price' && (sortAsc ? '↑' : '↓')}
            </th>
            <th
              onClick={() => onSort('status')}
              className="cursor-pointer px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hover:text-gray-700"
            >
              Status {sortBy === 'status' && (sortAsc ? '↑' : '↓')}
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product) => (
            <tr key={product.id} className={selectedIds.has(product.id) ? 'bg-blue-50' : ''}>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(product.id)}
                  onChange={() => onToggleSelect(product.id)}
                  className="rounded border-gray-300 text-teak focus:ring-teak"
                />
              </td>
              <td className="px-4 py-3">
                {product.mockup_urls && product.mockup_urls.length > 0 ? (
                  <img
                    src={product.mockup_urls[0]}
                    alt=""
                    className="h-10 w-10 rounded border object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded border bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    No img
                  </div>
                )}
              </td>
              <td
                className="px-4 py-3 text-sm text-gray-900 cursor-pointer hover:bg-gray-50"
                onClick={() => onStartEdit(product.id, 'name', product.name)}
              >
                {editingCell?.productId === product.id && editingCell.field === 'name' ? (
                  <input
                    type="text"
                    value={editingCell.value as string}
                    onChange={(e) => onEditChange(e.target.value)}
                    onBlur={onSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSaveEdit();
                      if (e.key === 'Escape') onCancelEdit();
                    }}
                    autoFocus
                    className="w-full rounded border border-blue-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <span className="font-medium">{product.name}</span>
                )}
              </td>
              <td
                className="px-4 py-3 text-sm text-gray-600 cursor-pointer hover:bg-gray-50"
                onClick={() => onStartEdit(product.id, 'category', product.category || '')}
              >
                {editingCell?.productId === product.id && editingCell.field === 'category' ? (
                  <select
                    value={editingCell.value as string}
                    onChange={(e) => onEditChange(e.target.value)}
                    onBlur={onSaveEdit}
                    autoFocus
                    className="w-full rounded border border-blue-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  CATEGORIES.find((c) => c.value === product.category)?.label || product.category
                )}
              </td>
              <td
                className="px-4 py-3 text-sm text-gray-900 cursor-pointer hover:bg-gray-50"
                onClick={() => onStartEdit(product.id, 'base_price', product.base_price || 0)}
              >
                {editingCell?.productId === product.id && editingCell.field === 'base_price' ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editingCell.value as number}
                    onChange={(e) => onEditChange(parseFloat(e.target.value) || 0)}
                    onBlur={onSaveEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSaveEdit();
                      if (e.key === 'Escape') onCancelEdit();
                    }}
                    autoFocus
                    className="w-24 rounded border border-blue-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : product.base_price ? (
                  `$${product.base_price.toFixed(2)}`
                ) : (
                  '-'
                )}
              </td>
              <td
                className="px-4 py-3 cursor-pointer hover:bg-gray-50"
                onClick={() => onStartEdit(product.id, 'status', product.status || 'draft')}
              >
                {editingCell?.productId === product.id && editingCell.field === 'status' ? (
                  <select
                    value={editingCell.value as string}
                    onChange={(e) => onEditChange(e.target.value)}
                    onBlur={onSaveEdit}
                    autoFocus
                    className="rounded border border-blue-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'draft'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.status}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(product.id)}
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
  );
}
