export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  /** Packs of pack_size pieces. */
  quantity: number;
  /** Pieces per pack (1 when absent). */
  pack_size?: number;
  size: string | null;
  color: string | null;
  /** The server's current price per pack. */
  unit_price: number;
  options: Record<string, unknown> | null;
  created_at: string;
}

export interface Cart {
  id: string;
  portal_id: string;
  user_id: string;
  status: string;
  items: CartItem[];
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  size?: string;
  color?: string;
  // No price: the server sets it (a price sent and not matching is refused).
  options?: Record<string, unknown>;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
