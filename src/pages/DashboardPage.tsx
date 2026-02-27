import { useState, useEffect } from 'react';
import { getCompanyProfileByOrg } from '../api/companyProfiles';
import { getOrgEquipment } from '../api/equipment';
import { useOrganizationId } from '../hooks/useOrganizationId';
import type { CompanyProfile } from '../types/companyProfile';
import type { OrganizationEquipment } from '../types/equipment';
import StatCard from '../components/dashboard/StatCard';
import CompanyProfileCard from '../components/dashboard/CompanyProfileCard';
import EquipmentSummary from '../components/dashboard/EquipmentSummary';
import CreatePortalCTA from '../components/dashboard/CreatePortalCTA';
import Spinner from '../components/ui/Spinner';

export default function DashboardPage() {
  const orgId = useOrganizationId();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [equipment, setEquipment] = useState<OrganizationEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      return;
    }

    Promise.allSettled([
      getCompanyProfileByOrg(orgId).then(setProfile),
      getOrgEquipment(orgId).then(setEquipment),
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
        <StatCard label="Active Portals" value={0} subtitle="Create your first" />
        <StatCard label="Orders This Week" value={0} />
        <StatCard label="Revenue This Month" value="$0" />
        <StatCard label="Pending Proofs" value={0} />
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
