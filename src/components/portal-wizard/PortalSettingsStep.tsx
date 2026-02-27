import { type FormEvent } from 'react';

export interface PortalSettingsData {
  approvalWorkflow: string;
  selfRegistration: boolean;
  requirePo: boolean;
}

interface Props {
  slug: string;
  data: PortalSettingsData;
  onUpdate: (partial: Partial<PortalSettingsData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PortalSettingsStep({ slug, data, onUpdate, onNext, onBack }: Props) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Portal Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Configure how the portal works for your client.
        </p>
      </div>

      {/* Subdomain Display */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <p className="text-sm font-medium text-indigo-900">Portal URL</p>
        <p className="mt-1 text-sm text-indigo-700">
          <span className="font-mono">{slug}.teaky.com</span>
          <span className="ml-2 text-xs text-indigo-500">
            (also accessible at teaky.com/p/{slug})
          </span>
        </p>
      </div>

      {/* Approval Workflow */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Approval Workflow</label>
        <p className="mt-0.5 text-xs text-gray-500">
          Require approval before orders are processed?
        </p>
        <div className="mt-2 space-y-2">
          {[
            { value: 'none', label: 'No approval required', desc: 'Orders go directly to production' },
            { value: 'portal_admin_approval', label: 'Portal admin approval', desc: 'Client admin must approve each order' },
            { value: 'sales_rep_approval', label: 'Sales rep approval', desc: 'Your team approves each order' },
          ].map((option) => (
            <label key={option.value} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="approval"
                value={option.value}
                checked={data.approvalWorkflow === option.value}
                onChange={() => onUpdate({ approvalWorkflow: option.value })}
                className="mt-0.5 border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-500">{option.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-900">Self-Registration</p>
            <p className="text-xs text-gray-500">Allow users to create their own accounts on this portal</p>
          </div>
          <input
            type="checkbox"
            checked={data.selfRegistration}
            onChange={(e) => onUpdate({ selfRegistration: e.target.checked })}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </label>

        <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
          <div>
            <p className="text-sm font-medium text-gray-900">Require Purchase Order</p>
            <p className="text-xs text-gray-500">Require a PO number with every order</p>
          </div>
          <input
            type="checkbox"
            checked={data.requirePo}
            onChange={(e) => onUpdate({ requirePo: e.target.checked })}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </label>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Next
        </button>
      </div>
    </form>
  );
}
