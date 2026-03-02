import { useState, useEffect } from 'react';
import {
  getMISSettings,
  updateMISSettings,
  testMISConnection,
  getQueueMappings,
  updateQueueMappings,
  getSyncLog,
} from '../../api/mis';
import type { MISSettings, MISSyncLogEntry } from '../../types/mis';
import Spinner from '../../components/ui/Spinner';

const MIS_PROVIDERS = [
  { value: '', label: 'None' },
  { value: 'docketmanager', label: 'DocketManager' },
  { value: 'printavo', label: 'Printavo (Coming Soon)' },
  { value: 'shopvox', label: 'shopVOX (Coming Soon)' },
  { value: 'ordant', label: 'Ordant (Coming Soon)' },
];

const TEAKY_STATUSES = [
  'submitted',
  'pending_approval',
  'approved',
  'in_production',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
];

export default function IntegrationsPage() {
  const [, setSettings] = useState<MISSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string } | null>(null);
  const [provider, setProvider] = useState('');
  const [accountUrl, setAccountUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [autoPush, setAutoPush] = useState(true);
  const [webhookSecret, setWebhookSecret] = useState('');
  const [error, setError] = useState('');

  // Queue mapping state
  const [queueMapping, setQueueMapping] = useState<Record<string, string>>({});
  const [newQueueName, setNewQueueName] = useState('');
  const [newQueueStatus, setNewQueueStatus] = useState('in_production');
  const [savingQueue, setSavingQueue] = useState(false);

  // Sync log state
  const [syncLog, setSyncLog] = useState<MISSyncLogEntry[]>([]);
  const [showSyncLog, setShowSyncLog] = useState(false);

  useEffect(() => {
    getMISSettings()
      .then((s) => {
        setSettings(s);
        setProvider(s.mis_provider || '');
        const config = (s.mis_config as Record<string, unknown>) || {};
        setAccountUrl((config.account_url as string) || '');
        setApiKey((config.api_key as string) || '');
        setAutoPush(config.auto_push_on_approval !== false);
        setWebhookSecret((config.webhook_secret as string) || '');
      })
      .catch(() => setError('Failed to load MIS settings'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (provider === 'docketmanager') {
      getQueueMappings()
        .then((r) => setQueueMapping(r.queue_mapping))
        .catch(() => {});
    }
  }, [provider]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setTestResult(null);
    try {
      const config = provider
        ? {
            account_url: accountUrl,
            api_key: apiKey || null,
            auto_push_on_approval: autoPush,
            webhook_secret: webhookSecret || null,
            queue_mapping: queueMapping,
          }
        : null;
      const updated = await updateMISSettings({
        mis_provider: provider || null,
        mis_config: config,
      });
      setSettings(updated);
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testMISConnection();
      setTestResult({
        connected: result.connected,
        message: result.connected ? 'Connection successful!' : 'Connection failed',
      });
    } catch {
      setTestResult({ connected: false, message: 'Connection test failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleAddQueueMapping = () => {
    if (!newQueueName.trim()) return;
    setQueueMapping((prev) => ({ ...prev, [newQueueName.trim()]: newQueueStatus }));
    setNewQueueName('');
  };

  const handleRemoveQueueMapping = (key: string) => {
    setQueueMapping((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSaveQueueMappings = async () => {
    setSavingQueue(true);
    try {
      await updateQueueMappings(queueMapping);
    } catch {
      setError('Failed to save queue mappings');
    } finally {
      setSavingQueue(false);
    }
  };

  const handleLoadSyncLog = async () => {
    try {
      const entries = await getSyncLog();
      setSyncLog(entries);
      setShowSyncLog(true);
    } catch {
      setError('Failed to load sync log');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  const webhookUrl = accountUrl
    ? `${window.location.origin}/webhooks/docketmanager/{organization_id}`
    : '';

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Provider Selection & Connection */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">MIS Integration</h2>
        <p className="mt-1 text-sm text-gray-500">
          Connect your Management Information System to sync orders, customers, and production files.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">MIS Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="mt-1 w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {MIS_PROVIDERS.map((p) => (
                <option key={p.value} value={p.value} disabled={p.label.includes('Coming Soon')}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {provider === 'docketmanager' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Account URL</label>
                <input
                  type="url"
                  value={accountUrl}
                  onChange={(e) => setAccountUrl(e.target.value)}
                  placeholder="https://yourcompany.dfrnt.com"
                  className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your DocketManager API key"
                  className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto-push"
                  checked={autoPush}
                  onChange={(e) => setAutoPush(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <label htmlFor="auto-push" className="text-sm text-gray-700">
                  Auto-push orders to DocketManager on approval
                </label>
              </div>
            </>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>

            {provider && (
              <button
                onClick={handleTest}
                disabled={testing || !accountUrl}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
            )}
          </div>

          {testResult && (
            <div
              className={`rounded-md px-4 py-3 text-sm ${
                testResult.connected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {testResult.connected ? '\u2713' : '\u2717'} {testResult.message}
            </div>
          )}
        </div>
      </div>

      {/* DM-specific configuration */}
      {provider === 'docketmanager' && (
        <>
          {/* Webhook URL */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-md font-semibold text-gray-900">Webhook Configuration</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure DocketManager to send queue transition webhooks to this URL.
            </p>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="mt-1 w-full max-w-lg rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
              />
            </div>
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Webhook Secret</label>
              <input
                type="text"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder="Optional shared secret for webhook validation"
                className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Queue Mapping */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-md font-semibold text-gray-900">Queue Mapping</h3>
            <p className="mt-1 text-sm text-gray-500">
              Map DocketManager queue names to Teaky order statuses.
            </p>

            <div className="mt-4">
              {Object.entries(queueMapping).length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        DM Queue
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Teaky Status
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {Object.entries(queueMapping).map(([queue, status]) => (
                      <tr key={queue}>
                        <td className="px-3 py-2 text-sm text-gray-900">{queue}</td>
                        <td className="px-3 py-2">
                          <select
                            value={status}
                            onChange={(e) =>
                              setQueueMapping((prev) => ({ ...prev, [queue]: e.target.value }))
                            }
                            className="rounded border border-gray-300 px-2 py-1 text-sm"
                          >
                            {TEAKY_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            onClick={() => handleRemoveQueueMapping(queue)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-500">
                  No custom mappings. Default mappings will be used.
                </p>
              )}

              <div className="mt-3 flex items-end gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500">DM Queue Name</label>
                  <input
                    type="text"
                    value={newQueueName}
                    onChange={(e) => setNewQueueName(e.target.value)}
                    placeholder="e.g. Pre-Press"
                    className="mt-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Teaky Status</label>
                  <select
                    value={newQueueStatus}
                    onChange={(e) => setNewQueueStatus(e.target.value)}
                    className="mt-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
                  >
                    {TEAKY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddQueueMapping}
                  disabled={!newQueueName.trim()}
                  className="rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Add
                </button>
              </div>

              <div className="mt-3">
                <button
                  onClick={handleSaveQueueMappings}
                  disabled={savingQueue}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {savingQueue ? 'Saving...' : 'Save Queue Mappings'}
                </button>
              </div>
            </div>
          </div>

          {/* Sync Log */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-semibold text-gray-900">Recent Sync Log</h3>
                <p className="mt-1 text-sm text-gray-500">Recent MIS sync operations.</p>
              </div>
              <button
                onClick={handleLoadSyncLog}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                {showSyncLog ? 'Refresh' : 'Load'}
              </button>
            </div>

            {showSyncLog && (
              <div className="mt-4 overflow-x-auto">
                {syncLog.length === 0 ? (
                  <p className="text-sm text-gray-500">No sync operations recorded.</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Time
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Action
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Entity
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Error
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {syncLog.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                            {new Date(entry.created_at).toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-900">{entry.action}</td>
                          <td className="px-3 py-2 text-xs text-gray-500">
                            {entry.entity_type}
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                entry.status === 'success'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {entry.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs text-red-600 max-w-xs truncate">
                            {entry.error_message || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
