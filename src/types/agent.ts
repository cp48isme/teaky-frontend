export interface AgentTaskState {
  conversation_history: { role: string; content: string }[];
  working_files: string[];
  decisions_made: Record<string, unknown>[];
  pending_actions: Record<string, unknown>[];
  context_variables: Record<string, unknown>;
  channel_info: Record<string, unknown>;
}

export interface AgentTask {
  id: string;
  agent_type: string;
  status: string;
  organization_id: string;
  portal_id: string | null;
  assigned_to: string | null;
  initiated_by: string | null;
  channel: string | null;
  external_ref: string | null;
  state: AgentTaskState | null;
  confidence_score: number | null;
  escalation_reason: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface CreateAgentTaskRequest {
  agent_type: string;
  portal_id?: string;
  channel?: string;
  external_ref?: string;
}

export interface EscalateAgentTaskRequest {
  reason: string;
  assign_to?: string;
}

export interface TakeoverAgentTaskRequest {
  notes?: string;
}
