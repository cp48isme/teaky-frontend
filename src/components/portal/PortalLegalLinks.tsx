import { Link } from 'react-router-dom';
import { portalLegalPath } from '../../lib/portalLegal';

interface Props {
  slug: string;
  className?: string;
}

/** "Privacy" and "Terms" for a portal — in the storefront footer, on the staff
 * portal pages, and (as plain links) in the invitation email. */
export default function PortalLegalLinks({ slug, className = '' }: Props) {
  return (
    <nav aria-label="Legal" className={`flex items-center justify-center gap-4 text-xs text-gray-500 ${className}`}>
      <Link to={portalLegalPath(slug, 'privacy')} className="hover:text-gray-700">
        Privacy
      </Link>
      <Link to={portalLegalPath(slug, 'terms')} className="hover:text-gray-700">
        Terms
      </Link>
    </nav>
  );
}
