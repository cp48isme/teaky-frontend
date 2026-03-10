import { useNavigate } from 'react-router-dom';

interface Props {
  companyName: string;
  equipmentCount: number;
  capabilityCount: number;
  onComplete: () => void;
  onBack: () => void;
}

export default function CreatePortalStep({
  companyName,
  equipmentCount,
  capabilityCount,
  onComplete,
  onBack,
}: Props) {
  const navigate = useNavigate();

  const handleCreatePortal = async () => {
    await onComplete();
    navigate('/dashboard');
  };

  const handleExplore = async () => {
    await onComplete();
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          className="h-8 w-8 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          You're all set up!
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Great work, {companyName || 'there'}. Here's a summary of your
          profile:
        </p>
      </div>

      {/* Summary */}
      <div className="mx-auto max-w-sm space-y-2 rounded-lg bg-gray-50 p-4 text-left text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Company</span>
          <span className="font-medium text-gray-900">
            {companyName || '—'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Equipment</span>
          <span className="font-medium text-gray-900">
            {equipmentCount > 0 ? `${equipmentCount} items` : 'Not set'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Capabilities</span>
          <span className="font-medium text-gray-900">
            {capabilityCount > 0 ? `${capabilityCount} selected` : 'Not set'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Plan</span>
          <span className="font-medium text-gray-900">Free</span>
        </div>
      </div>

      {/* AI Agent Awareness */}
      <div className="mx-auto max-w-sm rounded-lg border border-teak/20 bg-teak/5 p-4 text-left">
        <p className="text-sm text-teak-dark font-medium">
          Your AI agents are ready
        </p>
        <p className="mt-1 text-xs text-gray-600">
          Your equipment and capabilities profile powers our AI agents. They'll
          use this to make smart recommendations as you build portals, process
          orders, and grow your business.
        </p>
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleCreatePortal}
          className="w-full rounded-md bg-teak-dark px-6 py-3 text-sm font-medium text-white hover:bg-teak"
        >
          Create Your First Portal
        </button>
        <button
          type="button"
          onClick={handleExplore}
          className="w-full rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Explore the Dashboard
        </button>
      </div>

      <div className="flex justify-start pt-2">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
}
