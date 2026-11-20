import { Link } from 'react-router-dom';
import { currentRoles, hasFloorRole, isBuyerRole, PRODUCTION_LANDING } from '../lib/roles';

/** Walk t09 (20 Nov 2026): an address that is nothing in Teaky says so and
 * offers the way back, instead of a blank page. */
export default function NotFoundPage() {
  const roles = currentRoles();
  const home = roles.length === 0 ? '/' : hasFloorRole(roles) ? PRODUCTION_LANDING : roles.some(isBuyerRole) ? '/' : '/dashboard';
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-start justify-center gap-4 px-6 py-16" data-testid="not-found">
      <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Nothing at this address</p>
      <h1 className="font-heading text-2xl font-semibold text-brand-dark">That page does not exist in Teaky.</h1>
      <p className="text-gray-600">Check the link you followed, or go back to where you were working.</p>
      <div className="flex flex-wrap gap-3">
        <Link to={home} className="rounded-lg bg-teak-dark px-4 py-2 text-sm font-semibold text-white hover:bg-teak">
          Take me back
        </Link>
        <Link to="/report-a-bug" className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-brand-dark hover:bg-gray-50">
          Report a problem
        </Link>
      </div>
    </main>
  );
}
