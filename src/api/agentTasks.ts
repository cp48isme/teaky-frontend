import { apiRequest } from './client';
import type { AgentTask, AgentControlMetrics, CreateAgentTaskRequest, EscalateAgentTaskRequest, DraftActionResponse } from '../types/agent';
import type { Message } from '../types/message';

export async function listAgentTasks(
  status?: string,
  agentType?: string,
  limit = 50,
  offset = 0,
): Promise<AgentTask[]> {
  const params = new URLSearchParams();
  if (status) params.set('status_filter', status);
  if (agentType) params.set('agent_type', agentType);
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  return apiRequest<AgentTask[]>(`/agent-tasks?${params}`);
}

export async function getAgentTask(taskId: string): Promise<AgentTask> {
  return apiRequest<AgentTask>(`/agent-tasks/${taskId}`);
}

export async function createAgentTask(data: CreateAgentTaskRequest): Promise<AgentTask> {
  return apiRequest<AgentTask>('/agent-tasks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function escalateAgentTask(
  taskId: string,
  data: EscalateAgentTaskRequest,
): Promise<AgentTask> {
  return apiRequest<AgentTask>(`/agent-tasks/${taskId}/escalate`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export const approveDraft = (
  taskId: string,
  body?: string,
): Promise<DraftActionResponse> =>
  apiRequest<DraftActionResponse>(`/agent-tasks/${taskId}/approve-draft`, {
    method: 'POST',
    body: JSON.stringify(body !== undefined ? { body } : {}),
  });

export const rejectDraft = (taskId: string): Promise<DraftActionResponse> =>
  apiRequest<DraftActionResponse>(`/agent-tasks/${taskId}/reject-draft`, {
    method: 'POST',
  });

export async function takeoverAgentTask(taskId: string): Promise<AgentTask> {
  return apiRequest<AgentTask>(`/agent-tasks/${taskId}/takeover`, {
    method: 'POST',
    body: JSON.stringify({}),
  });
}

export async function resumeAgentTask(taskId: string): Promise<AgentTask> {
  return apiRequest<AgentTask>(`/agent-tasks/${taskId}/resume`, {
    method: 'POST',
  });
}

export async function completeAgentTask(taskId: string): Promise<AgentTask> {
  return apiRequest<AgentTask>(`/agent-tasks/${taskId}/complete`, {
    method: 'POST',
  });
}

export async function getTaskMessages(
  taskId: string,
  limit = 100,
  offset = 0,
): Promise<Message[]> {
  return apiRequest<Message[]>(`/agent-tasks/${taskId}/messages?limit=${limit}&offset=${offset}`);
}

export async function getAgentMetrics(): Promise<AgentControlMetrics> {
  return apiRequest<AgentControlMetrics>('/agent-control/metrics');
}

export async function sendTaskMessage(
  taskId: string,
  body: string,
  channel: string,
  recipientPhone?: string,
): Promise<Message> {
  return apiRequest<Message>(`/agent-tasks/${taskId}/messages`, {
    method: 'POST',
    body: JSON.stringify({
      channel,
      body,
      recipient_phone: recipientPhone || undefined,
    }),
  });
}

export async function listMessages(
  channel?: string,
  limit = 50,
  offset = 0,
): Promise<Message[]> {
  const params = new URLSearchParams();
  if (channel) params.set('channel', channel);
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  return apiRequest<Message[]>(`/messages?${params}`);
}
