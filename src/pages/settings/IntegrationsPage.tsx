import { useState, useEffect } from 'react';
import {
  getMISSettings,
  updateMISSettings,
  testMISConnection,
  getQueueMappings,
  updateQueueMappings,
  getSyncLog,
} from '../../api/mis';
import {
  getQuickBooksStatus,
  getQuickBooksConnectUrl,
} from '../../api/quickbooks';
import {
  isDMConfig,
  isGenericCSVConfig,
  isGenericWebhookConfig,
  isPrintavoConfig,
  isShopVOXConfig,
  type MISConfig,
  type MISSettings,
  type MISSyncLogEntry,
} from '../../types/mis';
import type { QuickBooksStatus } from '../../types/quickbooks';
import Spinner from '../../components/ui/Spinner';

const MIS_PROVIDERS = [
  { value: '', label: 'None' },
  { value: 'docketmanager', label: 'DocketManager' },
  { value: 'printavo', label: 'Printavo' },
  { value: 'shopvox', label: 'shopVOX' },
  { value: 'generic_csv', label: 'Manual / CSV Export' },
  { value: 'generic_webhook', label: 'Webhook Integration' },
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

// Resolve the auto_push toggle value when the user switches the provider
// dropdown. Switch-back to the originally-loaded provider restores the saved
// value from in-memory settings (no refetch). Any other transition defaults
// to BE's auto_push_on_approval=true. CSV/Webhook providers don't carry the
// field — the toggle isn't rendered for them, so the default is harmless.
function resolveAutoPushForProvider(
  newProvider: string,
  settings: MISSettings | null,
): boolean {
  if (
    settings === null ||
    settings.mis_config === null ||
    newProvider !== settings.mis_provider
  ) {
    return true;
  }
  const cfg = settings.mis_config;
  if (isDMConfig(cfg) || isPrintavoConfig(cfg) || isShopVOXConfig(cfg)) {
    return cfg.auto_push_on_approval;
  }
  return true;
}

export default function IntegrationsPage() {
  const [settings, setSettings] = useState<MISSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string } | null>(null);
  const [provider, setProvider] = useState('');
  const [error, setError] = useState('');

  // DocketManager config
  const [accountUrl, setAccountUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [autoPush, setAutoPush] = useState(true);
  const [webhookSecret, setWebhookSecret] = useState('');

  // Printavo config
  const [printavoApiToken, setPrintavoApiToken] = useState('');
  const [printavoShopEmail, setPrintavoShopEmail] = useState('');

  // shopVOX config
  const [shopvoxApiUrl, setShopvoxApiUrl] = useState('');
  const [shopvoxApiKey, setShopvoxApiKey] = useState('');
  const [shopvoxAppId, setShopvoxAppId] = useState('');

  // Generic CSV config
  const [csvNotificationEmail, setCsvNotificationEmail] = useState('');

  // Generic Webhook config
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookSecretHeader, setWebhookSecretHeader] = useState('');

  // Queue mapping state
  const [queueMapping, setQueueMapping] = useState<Record<string, string>>({});
  const [newQueueName, setNewQueueName] = useState('');
  const [newQueueStatus, setNewQueueStatus] = useState('in_production');
  const [savingQueue, setSavingQueue] = useState(false);

  // Sync log state
  const [syncLog, setSyncLog] = useState<MISSyncLogEntry[]>([]);
  const [showSyncLog, setShowSyncLog] = useState(false);

  // QuickBooks state
  const [qbStatus, setQbStatus] = useState<QuickBooksStatus | null>(null);
  const [qbLoading, setQbLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const s = await getMISSettings();
        setSettings(s);
        setProvider(s.mis_provider || '');

        const config = s.mis_config;
        if (config === null) {
          // No saved config — leave state at defaults
        } else if (isDMConfig(config)) {
          setAccountUrl(config.account_url);
          setApiKey(config.api_key ?? '');
          setWebhookSecret(config.webhook_secret ?? '');
          setAutoPush(config.auto_push_on_approval);
        } else if (isPrintavoConfig(config)) {
          setPrintavoApiToken(config.api_token);
          setPrintavoShopEmail(config.shop_email);
          setAutoPush(config.auto_push_on_approval);
        } else if (isShopVOXConfig(config)) {
          setShopvoxApiUrl(config.api_url);
          setShopvoxApiKey(config.api_key);
          setShopvoxAppId(config.app_id);
          setAutoPush(config.auto_push_on_approval);
        } else if (isGenericCSVConfig(config)) {
          setCsvNotificationEmail(config.notification_email);
        } else if (isGenericWebhookConfig(config)) {
          setWebhookUrl(config.webhook_url);
          setWebhookSecretHeader(config.webhook_secret ?? '');
        }
      } catch {
        setError('Failed to load MIS settings');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Load QuickBooks status
    getQuickBooksStatus().then(setQbStatus).catch(() => {});
  }, []);

  useEffect(() => {
    if (provider === 'docketmanager') {
      getQueueMappings()
        .then((r) => setQueueMapping(r.queue_mapping))
        .catch(() => {});
    }
  }, [provider]);

  const buildConfig = (): MISConfig | null => {
    switch (provider) {
      case 'docketmanager':
        return {
          account_url: accountUrl,
          api_key: apiKey || null,
          webhook_secret: webhookSecret || null,
          queue_mapping: queueMapping,
          auto_push_on_approval: autoPush,
        };
      case 'printavo':
        return {
          api_token: printavoApiToken,
          shop_email: printavoShopEmail,
          auto_push_on_approval: autoPush,
        };
      case 'shopvox':
        return {
          api_url: shopvoxApiUrl,
          api_key: shopvoxApiKey,
          app_id: shopvoxAppId,
          auto_push_on_approval: autoPush,
        };
      case 'generic_csv':
        return {
          notification_email: csvNotificationEmail,
          csv_format: 'standard',
        };
      case 'generic_webhook':
        return {
          webhook_url: webhookUrl,
          webhook_secret: webhookSecretHeader || null,
        };
      default:
        return null;
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setTestResult(null);
    try {
      const updated = await updateMISSettings({
        mis_provider: provider || null,
        mis_config: buildConfig(),
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

  const handleConnectQuickBooks = async () => {
    setQbLoading(true);
    try {
      const result = await getQuickBooksConnectUrl();
      window.location.href = result.authorization_url;
    } catch {
      setError('Failed to get QuickBooks connect URL');
      setQbLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  const dmWebhookUrl = accountUrl
    ? `${window.location.origin}/webhooks/docketmanager/{organization_id}`
    : '';

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* MIS Integration */}
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
              onChange={(e) => {
                const newProvider = e.target.value;
                setProvider(newProvider);
                setAutoPush(resolveAutoPushForProvider(newProvider, settings));
              }}
              className="mt-1 w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {MIS_PROVIDERS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* DocketManager Config */}
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
            </>
          )}

          {/* Printavo Config */}
          {provider === 'printavo' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">API Token</label>
                <input
                  type="password"
                  value={printavoApiToken}
                  onChange={(e) => setPrintavoApiToken(e.target.value)}
                  placeholder="Enter your Printavo API token"
                  className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shop Email</label>
                <input
                  type="email"
                  value={printavoShopEmail}
                  onChange={(e) => setPrintavoShopEmail(e.target.value)}
                  placeholder="shop@example.com"
                  className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          {/* shopVOX Config */}
          {provider === 'shopvox' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">API URL</label>
                <input
                  type="url"
                  value={shopvoxApiUrl}
                  onChange={(e) => setShopvoxApiUrl(e.target.value)}
                  placeholder="https://api.shopvox.com"
                  className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">API Key</label>
                <input
                  type="password"
                  value={shopvoxApiKey}
                  onChange={(e) => setShopvoxApiKey(e.target.value)}
                  placeholder="Enter your shopVOX API key"
                  className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">App ID</label>
                <input
                  type="text"
                  value={shopvoxAppId}
                  onChange={(e) => setShopvoxAppId(e.target.value)}
                  placeholder="Your shopVOX App ID"
                  className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          {/* Generic CSV Config */}
          {provider === 'generic_csv' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Notification Email</label>
              <p className="text-xs text-gray-500 mt-0.5">
                Job tickets will be generated as CSV and sent to this email address.
              </p>
              <input
                type="email"
                value={csvNotificationEmail}
                onChange={(e) => setCsvNotificationEmail(e.target.value)}
                placeholder="production@yourshop.com"
                className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          )}

          {/* Generic Webhook Config */}
          {provider === 'generic_webhook' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
                <p className="text-xs text-gray-500 mt-0.5">
                  Orders will be posted as JSON to this endpoint.
                </p>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://your-system.com/api/orders"
                  className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Webhook Secret (optional)</label>
                <input
                  type="text"
                  value={webhookSecretHeader}
                  onChange={(e) => setWebhookSecretHeader(e.target.value)}
                  placeholder="Shared secret for X-Webhook-Secret header"
                  className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </>
          )}

          {/* Auto-push toggle — rendered for providers that support it */}
          {(provider === 'docketmanager' ||
            provider === 'printavo' ||
            provider === 'shopvox') && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-push"
                checked={autoPush}
                onChange={(e) => setAutoPush(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-teak-dark"
              />
              <label htmlFor="auto-push" className="text-sm text-gray-700">
                Auto-push orders on approval
              </label>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>

            {provider && (
              <button
                onClick={handleTest}
                disabled={testing}
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
                value={dmWebhookUrl}
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
                  className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
                >
                  Add
                </button>
              </div>

              <div className="mt-3">
                <button
                  onClick={handleSaveQueueMappings}
                  disabled={savingQueue}
                  className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
                >
                  {savingQueue ? 'Saving...' : 'Save Queue Mappings'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sync Log */}
      {provider && (
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
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Error</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {syncLog.map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(entry.created_at).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-900">{entry.action}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{entry.entity_type}</td>
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
      )}

      {/* QuickBooks Integration */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">QuickBooks Online</h2>
        <p className="mt-1 text-sm text-gray-500">
          Connect QuickBooks Online to automatically sync invoices and payments.
        </p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${
                qbStatus?.connected ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-sm text-gray-700">
              {qbStatus?.connected
                ? `Connected (Realm: ${qbStatus.realm_id})`
                : 'Not connected'}
            </span>
          </div>

          {qbStatus?.connected && qbStatus.connected_at && (
            <p className="text-xs text-gray-500">
              Connected since: {new Date(qbStatus.connected_at).toLocaleDateString()}
            </p>
          )}

          {!qbStatus?.connected && (
            <button
              onClick={handleConnectQuickBooks}
              disabled={qbLoading}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {qbLoading ? 'Connecting...' : 'Connect QuickBooks'}
            </button>
          )}

          {qbStatus?.connected && (
            <p className="text-xs text-gray-500">
              Invoices are automatically created in QuickBooks when orders are placed.
              Use the "Sync to QB" button on individual orders to manually sync.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
