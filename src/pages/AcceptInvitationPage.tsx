import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../api/client';
import { acceptInvitation } from '../api/team';
import Spinner from '../components/ui/Spinner';

export default function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAccept = async () => {
    if (!token) return;
    setAccepting(true);
    setError('');
    try {
      await acceptInvitation(token);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg border bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900">Accept Invitation</h1>
          <p className="mt-3 text-sm text-gray-600">
            You need to be logged in to accept this invitation.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg border bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Invitation Accepted!</h1>
          <p className="mt-2 text-sm text-gray-600">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900">Accept Invitation</h1>
        <p className="mt-3 text-sm text-gray-600">
          Click below to accept and join the organization.
        </p>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handleAccept}
          disabled={accepting}
          className="mt-6 w-full rounded-md bg-teak-dark px-4 py-2.5 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
        >
          {accepting ? <Spinner className="mx-auto h-5 w-5 text-white" /> : 'Accept Invitation'}
        </button>
      </div>
    </div>
  );
}
