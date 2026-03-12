import { Link } from 'react-router-dom';

export default function CreatePortalCTA() {
  return (
    <div className="rounded-lg border-2 border-dashed border-teak/30 bg-teak/10 p-8 text-center">
      <h3 className="font-heading text-xl font-bold text-brand-dark">
        Ready to create your first client portal?
      </h3>
      <p className="mt-3 text-base text-gray-600">
        Build a branded storefront for your client in minutes. Add products,
        set pricing, and publish.
      </p>
      <Link
        to="/portals/create"
        className="mt-6 inline-flex items-center rounded-md bg-coral px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral/90"
      >
        Create Portal &rarr;
      </Link>
    </div>
  );
}
