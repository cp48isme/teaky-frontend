import { useState, useEffect } from 'react';
import { searchMasterCatalog, cloneProductToPortal } from '../../api/master-catalog';
import type { MasterCatalogProduct } from '../../types/master-catalog';
import Spinner from './Spinner';

interface Props {
  portalId: string;
  onClose: () => void;
  onClone: (product: MasterCatalogProduct) => Promise<void>;
}

export default function MasterCatalogBrowser({ portalId, onClose, onClone }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<MasterCatalogProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [cloning, setCloninId] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // This would call getMasterCatalogCategories() if available
        // For now, mock common categories
        setCategories([
          'Apparel',
          'Signage',
          'Business Cards',
          'Promotional Items',
          'Packaging',
          'Awards & Recognition',
          'Mugs & Drinkware',
          'Bags & Totes',
          'Headwear',
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim() && !category) {
        setResults([]);
        return;
      }
      setSearching(true);
      try {
        const data = await searchMasterCatalog({
          query: query.trim() || undefined,
          category: category || undefined,
          limit: 20,
        });
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, category]);

  const handleClone = async (product: MasterCatalogProduct) => {
    setCloninId(product.id);
    try {
      await cloneProductToPortal(product.id, portalId);
      await onClone(product);
    } finally {
      setCloninId(null);
    }
  };

  if (loadingCategories) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-6 w-6 text-teak-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Browse Master Catalog</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products (e.g., polo shirt, mug, banner)..."
          className="block flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-teak focus:outline-none focus:ring-teak sm:text-sm"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-teak focus:outline-none focus:ring-teak"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {searching && (
        <div className="flex items-center justify-center py-8">
          <Spinner className="h-6 w-6 text-teak-dark" />
        </div>
      )}

      {!searching && results.length > 0 && (
        <div className="max-h-96 overflow-y-auto space-y-2 rounded-md border border-gray-200">
          {results.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b border-gray-100 px-4 py-3 hover:bg-gray-50"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {product.category} {product.supplier && `• ${product.supplier}`}
                </p>
                {product.description && (
                  <p className="mt-1 text-xs text-gray-600 line-clamp-1">
                    {product.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleClone(product)}
                disabled={cloning === product.id}
                className="ml-2 whitespace-nowrap rounded-md bg-teak/15 px-3 py-1 text-xs font-medium text-teak-dark hover:bg-teak/20 disabled:opacity-50"
              >
                {cloning === product.id ? (
                  <Spinner className="h-3 w-3 inline" />
                ) : (
                  '+ Clone'
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {!searching && query.trim() && results.length === 0 && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          No products found for "{query}". Try different keywords or browse by category.
        </p>
      )}

      {!searching && !query.trim() && !category && (
        <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600 text-center">
          Enter a search term or select a category to browse products.
        </p>
      )}
    </div>
  );
}
