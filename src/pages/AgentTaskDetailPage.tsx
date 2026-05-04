import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getAgentTask,
  getTaskMessages,
  takeoverAgentTask,
  resumeAgentTask,
  completeAgentTask,
  escalateAgentTask,
  sendTaskMessage,
  approveDraft,
  rejectDraft,
} from '../api/agentTasks';
import type { AgentTask } from '../types/agent';
import type { Message } from '../types/message';
import Spinner from '../components/ui/Spinner';
import Breadcrumbs from '../components/ui/Breadcrumbs';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  awaiting_human: 'bg-orange-100 text-orange-800',
  awaiting_review: 'bg-purple-100 text-purple-800',
  escalated: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export default function AgentTaskDetailPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<AgentTask | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [editedDraft, setEditedDraft] = useState<string>('');
  const [isSubmittingDraft, setIsSubmittingDraft] = useState<boolean>(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  const loadData = async () => {
    if (!taskId) return;
    try {
      const [taskData, msgData] = await Promise.all([
        getAgentTask(taskId),
        getTaskMessages(taskId),
      ]);
      setTask(taskData);
      setMessages(msgData);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll every 10 seconds for active tasks
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [taskId]);

  useEffect(() => {
    setEditedDraft(task?.state?.draft_response ?? '');
  }, [task?.state?.draft_response]);

  const handleTakeover = async () => {
    if (!taskId) return;
    setActing(true);
    try {
      const updated = await takeoverAgentTask(taskId);
      setTask(updated);
    } finally {
      setActing(false);
    }
  };

  const handleResume = async () => {
    if (!taskId) return;
    setActing(true);
    try {
      const updated = await resumeAgentTask(taskId);
      setTask(updated);
    } finally {
      setActing(false);
    }
  };

  const handleComplete = async () => {
    if (!taskId) return;
    setActing(true);
    try {
      const updated = await completeAgentTask(taskId);
      setTask(updated);
    } finally {
      setActing(false);
    }
  };

  const handleEscalate = async () => {
    if (!taskId) return;
    setActing(true);
    try {
      const updated = await escalateAgentTask(taskId, {
        reason: 'Manually escalated by operator',
      });
      setTask(updated);
    } finally {
      setActing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!taskId || !newMessage.trim() || !task) return;
    setSending(true);
    try {
      const channel = task.channel || 'sms';
      await sendTaskMessage(
        taskId,
        newMessage.trim(),
        channel,
        task.external_ref || undefined,
      );
      setNewMessage('');
      // Refresh messages
      const msgs = await getTaskMessages(taskId);
      setMessages(msgs);
    } catch {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleApproveDraft = async () => {
    if (!task) return;
    const original = task.state?.draft_response ?? '';
    if (editedDraft.trim() === '') return;
    setIsSubmittingDraft(true);
    setDraftError(null);
    try {
      await approveDraft(
        task.id,
        editedDraft === original ? undefined : editedDraft,
      );
      const [updated, msgs] = await Promise.all([
        getAgentTask(task.id),
        getTaskMessages(task.id),
      ]);
      setTask(updated);
      setMessages(msgs);
    } catch (err) {
      setDraftError(
        err instanceof Error ? err.message : 'Failed to approve draft',
      );
    } finally {
      setIsSubmittingDraft(false);
    }
  };

  const handleRejectDraft = async () => {
    if (!task) return;
    setIsSubmittingDraft(true);
    setDraftError(null);
    try {
      await rejectDraft(task.id);
      const [updated, msgs] = await Promise.all([
        getAgentTask(task.id),
        getTaskMessages(task.id),
      ]);
      setTask(updated);
      setMessages(msgs);
    } catch (err) {
      setDraftError(
        err instanceof Error ? err.message : 'Failed to reject draft',
      );
    } finally {
      setIsSubmittingDraft(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">Task not found</div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Agents', to: '/agents' },
        { label: `${task.agent_type} Task` },
      ]} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-lg font-semibold text-brand-dark">
            {task.agent_type} Task
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {task.external_ref && `Contact: ${task.external_ref}`}
            {task.channel && ` via ${task.channel.toUpperCase()}`}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {task.status.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {(task.status === 'escalated' || task.status === 'in_progress') && (
          <button
            onClick={handleTakeover}
            disabled={acting}
            className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
          >
            Take Over
          </button>
        )}
        {task.status === 'awaiting_human' && (
          <button
            onClick={handleResume}
            disabled={acting}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Resume Agent
          </button>
        )}
        {task.status === 'in_progress' && (
          <button
            onClick={handleEscalate}
            disabled={acting}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            Escalate
          </button>
        )}
        {['in_progress', 'awaiting_human', 'escalated'].includes(task.status) && (
          <button
            onClick={handleComplete}
            disabled={acting}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            Mark Complete
          </button>
        )}
      </div>

      {task.status === 'awaiting_review' && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Review draft response
          </h3>
          <textarea
            className="w-full border rounded p-2 text-sm font-mono"
            rows={4}
            value={editedDraft}
            onChange={(e) => setEditedDraft(e.target.value)}
            disabled={isSubmittingDraft}
          />
          {draftError && (
            <div
              role="alert"
              className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800"
            >
              {draftError}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={isSubmittingDraft || editedDraft.trim() === ''}
              onClick={handleApproveDraft}
              className="px-3 py-1.5 bg-green-600 text-white rounded text-sm disabled:opacity-50"
            >
              {isSubmittingDraft ? 'Sending…' : 'Approve & Send'}
            </button>
            <button
              type="button"
              disabled={isSubmittingDraft}
              onClick={handleRejectDraft}
              className="px-3 py-1.5 bg-red-600 text-white rounded text-sm disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Task Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Info Panel */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-medium text-gray-900">Task Details</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">ID</dt>
              <dd className="font-mono text-gray-900">{task.id.slice(0, 8)}...</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Agent Type</dt>
              <dd className="text-gray-900">{task.agent_type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Channel</dt>
              <dd className="text-gray-900">{task.channel || '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Confidence</dt>
              <dd className="text-gray-900">
                {task.confidence_score != null
                  ? `${(task.confidence_score * 100).toFixed(0)}%`
                  : '—'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd className="text-gray-900">
                {new Date(task.created_at).toLocaleString()}
              </dd>
            </div>
            {task.escalation_reason && (
              <div className="pt-2">
                <dt className="text-gray-500">Escalation Reason</dt>
                <dd className="mt-1 text-sm text-red-700">{task.escalation_reason}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Agent State */}
        {task.state && (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-medium text-gray-900">Agent State</h3>
            <div className="mt-3 space-y-3 text-sm">
              {task.state.decisions_made.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Decisions Made</p>
                  <ul className="mt-1 list-inside list-disc text-gray-600">
                    {task.state.decisions_made.map((d, i) => (
                      <li key={i}>{JSON.stringify(d)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {task.state.pending_actions.length > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Pending Actions</p>
                  <ul className="mt-1 list-inside list-disc text-gray-600">
                    {task.state.pending_actions.map((a, i) => (
                      <li key={i}>{JSON.stringify(a)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {Object.keys(task.state.context_variables).length > 0 && (
                <div>
                  <p className="font-medium text-gray-700">Context</p>
                  <pre className="mt-1 max-h-40 overflow-auto rounded bg-gray-50 p-2 text-xs text-gray-700">
                    {JSON.stringify(task.state.context_variables, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Conversation */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-medium text-gray-900">
            Conversation ({messages.length} messages)
          </h3>
        </div>
        <div className="max-h-96 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.direction === 'outbound' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                    msg.direction === 'outbound'
                      ? 'bg-teak-dark text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{msg.body}</p>
                  <p
                    className={`mt-1 text-xs ${
                      msg.direction === 'outbound' ? 'text-white/60' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Message compose */}
        {['in_progress', 'awaiting_human', 'escalated'].includes(task.status) && (
          <div className="border-t border-gray-200 px-4 py-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:outline-none focus:ring-1 focus:ring-teak"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
