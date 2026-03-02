export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
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
  unit_price: number;
  options?: Record<string, unknown>;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
