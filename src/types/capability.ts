export interface Capability {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  icon_name: string | null;
  sort_order: number;
  created_at: string;
}
