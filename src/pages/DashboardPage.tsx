import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCompanyProfileByOrg } from '../api/companyProfiles';
import { getOrgEquipment } from '../api/equipment';
import { getSummaryMetrics } from '../api/analytics';
import { useOrganizationId } from '../hooks/useOrganizationId';
import type { CompanyProfile } from '../types/companyProfile';
import type { OrganizationEquipment } from '../types/equipment';
import type { SummaryMetrics } from '../types/analytics';
import StatCard from '../components/dashboard/StatCard';
import CompanyProfileCard from '../components/dashboard/CompanyProfileCard';
import EquipmentSummary from '../components/dashboard/EquipmentSummary';
import CreatePortalCTA from '../components/dashboard/CreatePortalCTA';
import Spinner from '../components/ui/Spinner';

export default function DashboardPage() {
  const orgId = useOrganizationId();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [equipment, setEquipment] = useState<OrganizationEquipment[]>([]);
  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    Promise.allSettled([
      getCompanyProfileByOrg(orgId).then(setProfile),
      getOrgEquipment(orgId).then(setEquipment),
      getSummaryMetrics().then(setSummary),
    ]).finally(() => setLoading(false));
  }, [orgId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active Portals"
          value={summary?.active_portal_count ?? 0}
          subtitle={summary?.active_portal_count === 0 ? 'Create your first' : undefined}
        />
        <StatCard label="Orders" value={summary?.order_count ?? 0} />
        <StatCard
          label="Revenue"
          value={`$${(summary?.total_revenue ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        />
        <StatCard
          label="Pending Proofs"
          value={summary?.pending_proof_count ?? 0}
        />
      </div>

      {/* View Analytics Link */}
      <div className="flex justify-end">
        <Link
          to="/analytics"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          View Analytics →
        </Link>
      </div>

      {/* Create Portal CTA */}
      <CreatePortalCTA />

      {/* Profile + Equipment */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CompanyProfileCard profile={profile} />
        <EquipmentSummary equipment={equipment} />
      </div>
    </div>
  );
}
