/** What the buyer declared about a line's artwork (S88). */
export type ArtworkDisposition = 'reuse_unchanged' | 'changes_new_proof' | 'no_artwork';

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  /** Packs of pack_size pieces. */
  quantity: number;
  /** Pieces per pack (1 when absent). */
  pack_size?: number;
  size: string | null;
  /** The picked price option (e.g. a locking system), by label. */
  price_option?: string | null;
  color: string | null;
  /** The server's current price per pack. */
  unit_price: number;
  options: Record<string, unknown> | null;
  /** Null until the buyer declares; the server defaults it at order time. */
  artwork_disposition?: ArtworkDisposition | null;
  artwork_change_note?: string | null;
  artwork_upload_url?: string | null;
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
  price_option?: string;
  color?: string;
  // No price: the server sets it (a price sent and not matching is refused).
  options?: Record<string, unknown>;
  artwork_disposition?: ArtworkDisposition;
  artwork_change_note?: string;
  artwork_upload_url?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
  artwork_disposition?: ArtworkDisposition;
  artwork_change_note?: string;
  artwork_upload_url?: string;
}
