import { useState, useEffect } from 'react';
import { getMISSettings, updateMISSettings, testMISConnection } from '../../api/mis';
import type { MISSettings } from '../../types/mis';
import Spinner from '../../components/ui/Spinner';

const MIS_PROVIDERS = [
  { value: '', label: 'None' },
  { value: 'docketmanager', label: 'DocketManager' },
  { value: 'printavo', label: 'Printavo (Coming Soon)' },
  { value: 'shopvox', label: 'shopVOX (Coming Soon)' },
  { value: 'ordant', label: 'Ordant (Coming Soon)' },
];

export default function IntegrationsPage() {
  const [, setSettings] = useState<MISSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ connected: boolean; message: string } | null>(null);
  const [provider, setProvider] = useState('');
  const [accountUrl, setAccountUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getMISSettings()
      .then((s) => {
        setSettings(s);
        setProvider(s.mis_provider || '');
        setAccountUrl((s.mis_config as Record<string, string>)?.account_url || '');
      })
      .catch(() => setError('Failed to load MIS settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setTestResult(null);
    try {
      const updated = await updateMISSettings({
        mis_provider: provider || null,
        mis_config: provider ? { account_url: accountUrl } : null,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Account URL
              </label>
              <input
                type="url"
                value={accountUrl}
                onChange={(e) => setAccountUrl(e.target.value)}
                placeholder="https://yourcompany.dfrnt.com"
                className="mt-1 w-full max-w-md rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Your DocketManager account URL (e.g., https://yourcompany.dfrnt.com)
              </p>
            </div>
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
                testResult.connected
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {testResult.connected ? '✓' : '✗'} {testResult.message}
            </div>
          )}

          {provider === 'docketmanager' && (
            <div className="mt-4 rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Full configuration (Zapier setup, product mapping, queue mapping, Hot Folder config) available after connecting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
