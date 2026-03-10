import { Link } from 'react-router-dom';

export default function CreatePortalCTA() {
  return (
    <div className="rounded-lg border-2 border-dashed border-teak/30 bg-teak/10 p-8 text-center">
      <h3 className="font-heading text-lg font-semibold text-brand-dark">
        Ready to create your first client portal?
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Build a branded storefront for your client in minutes. Add products,
        set pricing, and publish.
      </p>
      <Link
        to="/portals/create"
        className="mt-4 inline-flex items-center rounded-md bg-teak-dark px-6 py-2.5 text-sm font-medium text-white hover:bg-teak"
      >
        Create Portal &rarr;
      </Link>
    </div>
  );
}
