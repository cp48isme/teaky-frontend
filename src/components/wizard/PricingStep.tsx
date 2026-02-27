interface Props {
  selectedApproach: string | null;
  onSelect: (approach: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const OPTIONS = [
  {
    value: 'own',
    title: "I'll set my own prices per product",
    description:
      'You enter each price manually when adding products to your portal.',
  },
  {
    value: 'suggested',
    title: 'Use suggested pricing and adjust',
    description:
      'We suggest prices based on category and market data. You can adjust before publishing.',
  },
  {
    value: 'later',
    title: "I'll do this later",
    description:
      'Skip for now. You can set up pricing in portal settings when you create your first store.',
  },
];

export default function PricingStep({
  selectedApproach,
  onSelect,
  onNext,
  onBack,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Pricing Approach
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          How would you like to set pricing for your products?
        </p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
              selectedApproach === opt.value
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="pricing"
              checked={selectedApproach === opt.value}
              onChange={() => onSelect(opt.value)}
              className="mt-0.5 h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                {opt.title}
              </span>
              <p className="mt-0.5 text-xs text-gray-500">{opt.description}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onNext}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
