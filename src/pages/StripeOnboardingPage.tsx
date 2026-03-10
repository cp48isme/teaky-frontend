import { useState, useEffect } from 'react';
import { getOnboardingLink, getStripeStatus } from '../api/stripe';
import Spinner from '../components/ui/Spinner';

export default function StripeOnboardingPage() {
  const [status, setStatus] = useState<{
    connected: boolean;
    charges_enabled: boolean;
    account_id: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    getStripeStatus()
      .then(setStatus)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const result = await getOnboardingLink();
      window.location.href = result.url;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to start onboarding');
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-brand-dark">Stripe Connect</h2>
      <p className="text-sm text-gray-500">
        Connect your Stripe account to receive payments from orders.
      </p>

      <div className="rounded-lg border bg-white p-6 space-y-4">
        {status?.charges_enabled ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Connected</p>
                <p className="text-sm text-gray-500">
                  Your Stripe account is ready to receive payments.
                </p>
              </div>
            </div>
            {status.account_id && (
              <p className="text-xs text-gray-400">Account: {status.account_id}</p>
            )}
          </>
        ) : status?.connected ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">Pending Verification</p>
                <p className="text-sm text-gray-500">
                  Your account is connected but not yet verified.
                </p>
              </div>
            </div>
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
            >
              {connecting ? 'Redirecting...' : 'Complete Setup'}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600">
              Connect your Stripe account to start accepting payments. Teaky takes a small
              platform fee on each transaction.
            </p>
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
            >
              {connecting ? 'Redirecting...' : 'Connect with Stripe'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
