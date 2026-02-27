import { Link } from 'react-router-dom';

export default function CreatePortalCTA() {
  return (
    <div className="rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50 p-8 text-center">
      <h3 className="text-lg font-semibold text-gray-900">
        Ready to create your first client portal?
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Build a branded storefront for your client in minutes. Add products,
        set pricing, and publish.
      </p>
      <Link
        to="/portals/create"
        className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Create Portal &rarr;
      </Link>
    </div>
  );
}
