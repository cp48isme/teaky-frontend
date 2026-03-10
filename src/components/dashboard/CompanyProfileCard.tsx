import type { CompanyProfile } from '../../types/companyProfile';

interface Props {
  profile: CompanyProfile | null;
}

export default function CompanyProfileCard({ profile }: Props) {
  if (!profile) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="font-heading text-sm font-semibold text-brand-dark">Company Profile</h3>
        <p className="mt-2 text-sm text-gray-500">
          No profile set up yet.{' '}
          <a href="/get-started" className="text-teak-dark hover:text-teak">
            Complete the wizard
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <h3 className="font-heading text-sm font-semibold text-brand-dark">Company Profile</h3>
        <a
          href="/get-started"
          className="text-xs text-teak-dark hover:text-teak"
        >
          Edit
        </a>
      </div>

      <div className="mt-4 flex items-start gap-4">
        {profile.logo_url && (
          <img
            src={profile.logo_url}
            alt="Logo"
            className="h-12 w-12 rounded-md border object-contain bg-white p-1"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <div className="space-y-1 text-sm">
          {profile.industry && (
            <p className="text-gray-600">
              <span className="font-medium">Industry:</span> {profile.industry}
            </p>
          )}
          {(profile.location_city || profile.location_state) && (
            <p className="text-gray-600">
              <span className="font-medium">Location:</span>{' '}
              {[profile.location_city, profile.location_state, profile.location_country]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
          {profile.website_url && (
            <p className="text-gray-600">
              <span className="font-medium">Website:</span>{' '}
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teak-dark hover:text-teak"
              >
                {profile.website_url}
              </a>
            </p>
          )}
          {profile.phone && (
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span> {profile.phone}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
