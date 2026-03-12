import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listAgentTasks, getAgentMetrics } from '../api/agentTasks';
import type { AgentTask, AgentControlMetrics } from '../types/agent';
import Spinner from '../components/ui/Spinner';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  awaiting_human: 'bg-orange-100 text-orange-800',
  escalated: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'awaiting_human', label: 'Awaiting Human' },
  { value: 'escalated', label: 'Escalated' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
];

export default function AgentControlCenterPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [metrics, setMetrics] = useState<AgentControlMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    // Fetch metrics once on mount
    getAgentMetrics().then(setMetrics).catch(() => {});
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await listAgentTasks(statusFilter || undefined);
        setTasks(data);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  const escalatedCount = metrics
    ? metrics.escalation_count
    : tasks.filter((t) => t.status === 'escalated' || t.status === 'awaiting_human').length;

  const statusCount = (s: string) =>
    metrics?.tasks_by_status.find((x) => x.status === s)?.count ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-brand-dark lg:text-4xl">Agent Control Center</h1>
          <p className="mt-2 text-base text-gray-600">
            Monitor and manage agent tasks across your organization
          </p>
        </div>
        {escalatedCount > 0 && (
          <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
            {escalatedCount} need attention
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {metrics?.total_tasks ?? tasks.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Active</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {statusCount('in_progress')}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Escalated</p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {statusCount('escalated')}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="mt-1 text-2xl font-bold text-green-600">
            {statusCount('completed')}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Escalation Rate</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">
            {metrics ? `${(metrics.escalation_rate * 100).toFixed(0)}%` : '—'}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Avg Resolution</p>
          <p className="mt-1 text-2xl font-bold text-gray-700">
            {metrics?.avg_resolution_hours != null
              ? `${metrics.avg_resolution_hours.toFixed(1)}h`
              : '—'}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-500">No agent tasks found</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Channel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Confidence
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/agents/${task.id}`)}
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {task.agent_type}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[task.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {task.channel || '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {task.external_ref || '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                    {task.confidence_score != null
                      ? `${(task.confidence_score * 100).toFixed(0)}%`
                      : '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {new Date(task.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
