import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyPortals, type MyPortal } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import Spinner from '../components/ui/Spinner';

/**
 * Where a signed-in buyer with several portals picks one, and where a buyer
 * with none is told so (belq, ruling 30 Oct 2026). Never the public landing
 * page, and never another sign-in form.
 */
export default function ChoosePortalPage() {
  const { logout } = useAuth();
  const [portals, setPortals] = useState<MyPortal[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    listMyPortals()
      .then((list) => setPortals(list.filter((p) => p.status === 'active')))
      .catch(() => setFailed(true));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-light px-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8">
        <h1 className="font-heading text-2xl font-bold text-brand-dark">Your ordering pages</h1>
        {portals === null && !failed && (
          <div className="mt-6 flex justify-center">
            <Spinner className="h-6 w-6 text-teak-dark" />
          </div>
        )}
        {failed && (
          <p className="mt-4 text-sm text-gray-700">
            Your ordering pages could not be loaded just now. Try again in a moment, or open the link the printer sent you.
          </p>
        )}
        {portals && portals.length > 1 && (
          <>
            <p className="mt-2 text-sm text-gray-600">You are signed in. Choose where to order.</p>
            <ul className="mt-6 space-y-2">
              {portals.map((p) => (
                <li key={p.id}>
                  <Link
                    to={`/p/${p.slug}`}
                    className="block rounded-md border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 hover:border-teak hover:bg-gray-50"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
        {portals && portals.length === 1 && (
          <p className="mt-4 text-sm text-gray-700">
            You are signed in.{' '}
            <Link to={`/p/${portals[0]!.slug}`} className="font-medium text-teak-dark hover:text-teak">
              Go to {portals[0]!.name}
            </Link>
            .
          </p>
        )}
        {portals && portals.length === 0 && (
          <p className="mt-4 text-sm text-gray-700">
            You are signed in, but your account is not attached to an ordering page yet. Contact the printer who invited
            you; they can add you to one.
          </p>
        )}
        <button
          type="button"
          onClick={() => void logout()}
          className="mt-8 text-sm text-gray-500 underline-offset-2 hover:underline"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
