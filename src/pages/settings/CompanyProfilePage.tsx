import { useEffect, useRef, useState, type FormEvent } from 'react';
import AuthedImage from '../../components/ui/AuthedImage';
import { createCompanyProfile, getCompanyProfileByOrg, updateCompanyProfile } from '../../api/companyProfiles';
import { updateMyOrganization } from '../../api/organizations';
import { uploadFile } from '../../api/uploads';
import Spinner from '../../components/ui/Spinner';
import { resetMyOrganization, useMyOrganization } from '../../hooks/useMyOrganization';
import { useOrganizationId } from '../../hooks/useOrganizationId';
import { canEditCompany, currentRoles } from '../../lib/roles';
import type { CompanyProfile } from '../../types/companyProfile';

/** The shop's own page (t06, 19 Nov 2026): display name (the organisation's
 * name — what the shell, the emails and the invitations carry), the logo
 * (upload or URL) and the contact details. A printer_admin edits; everyone
 * else on the settings hub reads. The email path to Teaky stays as a second
 * way in. */

interface Fields {
  name: string;
  logo_url: string;
  website_url: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  location_city: string;
  location_state: string;
  location_country: string;
  postal_code: string;
}

const EMPTY: Fields = {
  name: '',
  logo_url: '',
  website_url: '',
  phone: '',
  address_line1: '',
  address_line2: '',
  location_city: '',
  location_state: '',
  location_country: '',
  postal_code: '',
};

const CONTACT_FIELDS: { key: keyof Fields; label: string; autoComplete?: string }[] = [
  { key: 'website_url', label: 'Website' },
  { key: 'phone', label: 'Phone', autoComplete: 'tel' },
  { key: 'address_line1', label: 'Address line 1', autoComplete: 'address-line1' },
  { key: 'address_line2', label: 'Address line 2', autoComplete: 'address-line2' },
  { key: 'location_city', label: 'City', autoComplete: 'address-level2' },
  { key: 'location_state', label: 'State / region', autoComplete: 'address-level1' },
  { key: 'postal_code', label: 'Postal code', autoComplete: 'postal-code' },
  { key: 'location_country', label: 'Country', autoComplete: 'country-name' },
];

function fromProfile(name: string, profile: CompanyProfile | null): Fields {
  return {
    ...EMPTY,
    name,
    logo_url: profile?.logo_url ?? '',
    website_url: profile?.website_url ?? '',
    phone: profile?.phone ?? '',
    address_line1: profile?.address_line1 ?? '',
    address_line2: profile?.address_line2 ?? '',
    location_city: profile?.location_city ?? '',
    location_state: profile?.location_state ?? '',
    location_country: profile?.location_country ?? '',
    postal_code: profile?.postal_code ?? '',
  };
}

export default function CompanyProfilePage() {
  const orgId = useOrganizationId();
  const { organization, loaded } = useMyOrganization();
  const editable = canEditCompany(currentRoles());
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) {
      setProfileLoaded(true);
      return;
    }
    let alive = true;
    getCompanyProfileByOrg(orgId)
      .then((p) => {
        if (alive) setProfile(p);
      })
      .catch(() => {
        if (alive) setProfile(null);
      })
      .finally(() => {
        if (alive) setProfileLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [orgId]);

  // The form is seeded once, from the loaded name and profile; later edits are the user's.
  const seeded = useRef(false);
  useEffect(() => {
    if (!loaded || !profileLoaded || seeded.current) return;
    seeded.current = true;
    setFields(fromProfile(organization?.name ?? '', profile));
    setReady(true);
  }, [loaded, profileLoaded, organization, profile]);

  const set = (key: keyof Fields) => (e: { target: { value: string } }) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  async function onLogoFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await uploadFile(file);
      setFields((f) => ({ ...f, logo_url: uploaded.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The logo could not be uploaded.');
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editable) return;
    const name = fields.name.trim();
    if (!name) {
      setError('The shop needs a name.');
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      if (name !== (organization?.name ?? '')) {
        await updateMyOrganization({ name });
        resetMyOrganization();
      }
      const body = {
        logo_url: fields.logo_url.trim() || undefined,
        website_url: fields.website_url.trim() || undefined,
        phone: fields.phone.trim() || undefined,
        address_line1: fields.address_line1.trim() || undefined,
        address_line2: fields.address_line2.trim() || undefined,
        location_city: fields.location_city.trim() || undefined,
        location_state: fields.location_state.trim() || undefined,
        location_country: fields.location_country.trim() || undefined,
        postal_code: fields.postal_code.trim() || undefined,
      };
      const saved = profile ? await updateCompanyProfile(profile.id, body) : await createCompanyProfile(body);
      setProfile(saved);
      setMessage('Saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The changes could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  const input = 'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak-dark focus:outline-none focus:ring-1 focus:ring-teak-dark disabled:bg-gray-50 disabled:text-gray-500';

  return (
    <form onSubmit={onSubmit} className="space-y-8" aria-label="Company profile">
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="font-heading text-base font-semibold text-brand-dark">Shop</h2>
        <p className="mt-1 text-sm text-gray-500">
          The name and mark your team, your buyers and your emails see.
          {!editable && ' Only a shop admin can change them.'}
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-[auto,1fr]">
          <div>
            <div className="flex h-28 w-28 items-center justify-center rounded-md border border-gray-200 bg-white p-2">
              {fields.logo_url ? (
                <AuthedImage src={fields.logo_url} alt={`${fields.name || 'Shop'} logo`} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400">No logo</span>
              )}
            </div>
            {editable && (
              <label className="mt-2 inline-block cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100">
                {uploading ? 'Uploading…' : 'Upload logo'}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
                  className="sr-only"
                  aria-label="Upload logo"
                  disabled={uploading}
                  onChange={(e) => onLogoFile(e.target.files?.[0])}
                />
              </label>
            )}
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Display name
              <input className={input} value={fields.name} onChange={set('name')} disabled={!editable} maxLength={255} required />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Logo URL
              <input className={input} value={fields.logo_url} onChange={set('logo_url')} disabled={!editable} placeholder="https://… or upload a file" />
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="font-heading text-base font-semibold text-brand-dark">Contact details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {CONTACT_FIELDS.map((f) => (
            <label key={f.key} className="block text-sm font-medium text-gray-700">
              {f.label}
              <input className={input} value={fields[f.key]} onChange={set(f.key)} disabled={!editable} autoComplete={f.autoComplete} />
            </label>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4">
        {editable && (
          <button
            type="submit"
            disabled={saving || uploading}
            className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        )}
        {message && <span className="text-sm text-green-700" role="status">{message}</span>}
        {error && <span className="text-sm text-red-700" role="alert">{error}</span>}
        <span className="text-sm text-gray-500">You can also reply to any Teaky email to have it changed.</span>
      </div>
    </form>
  );
}
