import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPortal } from '../api/portals';
import type { Portal } from '../types/portal';
import Spinner from '../components/ui/Spinner';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import ProductManagementGrid from '../components/products/ProductManagementGrid';
import SplitScreenLayout from '../components/layout/SplitScreenLayout';

export default function ProductManagementPage() {
  const { portalId } = useParams<{ portalId: string }>();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!portalId) return;
    getPortal(portalId)
      .then(setPortal)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [portalId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  if (!portal || !portalId) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-red-600">Portal not found</p>
      </div>
    );
  }

  return (
    <SplitScreenLayout
      leftContent={
        <div className="space-y-6">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', to: '/dashboard' },
              { label: 'Portals', to: '/portals' },
              { label: portal.name, to: `/portals/${portalId}` },
              { label: 'Products' },
            ]}
          />

          {/* Header with View Live Store button */}
          <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-brand-dark">Products</h2>
        <a
          href={`/p/${portal.slug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-teak to-teak-dark px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-md transition"
        >
          <span>🌐</span>
          View Live Store
        </a>
      </div>

      {/* Product Management Grid */}
      <ProductManagementGrid portalId={portalId} />
        </div>
      }
      previewUrl={`/p/${portal.slug}`}
    />
  );
}
