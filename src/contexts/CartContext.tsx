import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { useParams } from 'react-router-dom';
import { isAuthenticated } from '../api/client';
import {
  getOrCreateCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
} from '../api/cart';
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '../types/cart';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  addItem: (data: AddToCartRequest) => Promise<void>;
  updateItem: (itemId: string, data: UpdateCartItemRequest) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { slug } = useParams<{ slug: string }>();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!slug || !isAuthenticated()) return;
    setLoading(true);
    try {
      const c = await getOrCreateCart(slug);
      setCart(c);
    } catch {
      // Cart might not exist yet, that's ok
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (data: AddToCartRequest) => {
      if (!slug) return;
      await apiAddToCart(slug, data);
      await refreshCart();
    },
    [slug, refreshCart],
  );

  const updateItem = useCallback(
    async (itemId: string, data: UpdateCartItemRequest) => {
      if (!slug) return;
      await apiUpdateCartItem(slug, itemId, data);
      await refreshCart();
    },
    [slug, refreshCart],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!slug) return;
      await apiRemoveCartItem(slug, itemId);
      await refreshCart();
    },
    [slug, refreshCart],
  );

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, itemCount, addItem, updateItem, removeItem, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
