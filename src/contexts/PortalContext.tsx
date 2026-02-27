import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicPortal, getPublicProducts } from '../api/portals';
import type { PublicPortalResponse } from '../types/portal';
import type { Product } from '../types/product';

interface PortalContextValue {
  portal: PublicPortalResponse | null;
  products: Product[];
  loading: boolean;
  error: string;
}

const PortalContext = createContext<PortalContextValue>({
  portal: null,
  products: [],
  loading: true,
  error: '',
});

export function usePortalContext() {
  return useContext(PortalContext);
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const [portal, setPortal] = useState<PublicPortalResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError('No portal specified');
      return;
    }

    Promise.all([getPublicPortal(slug), getPublicProducts(slug)])
      .then(([p, prods]) => {
        setPortal(p);
        setProducts(prods);
      })
      .catch(() => setError('Portal not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <PortalContext.Provider value={{ portal, products, loading, error }}>
      {portal?.brand_config && (
        <style>{`
          :root {
            --portal-primary: ${portal.brand_config.primary_color || '#4F46E5'};
            --portal-secondary: ${portal.brand_config.secondary_color || '#6B7280'};
            --portal-accent: ${portal.brand_config.accent_color || '#F59E0B'};
          }
        `}</style>
      )}
      {children}
    </PortalContext.Provider>
  );
}
