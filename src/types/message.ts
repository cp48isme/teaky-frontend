export interface Message {
  id: string;
  agent_task_id: string | null;
  organization_id: string;
  order_id: string | null;
  channel: string;
  direction: string;
  sender_phone: string | null;
  recipient_phone: string | null;
  sender_email: string | null;
  recipient_email: string | null;
  body: string;
  metadata_: Record<string, unknown> | null;
  external_id: string | null;
  created_at: string;
}
