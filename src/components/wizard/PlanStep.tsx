interface Props {
  onNext: () => void;
  onBack: () => void;
}

const PLANS = [
  {
    name: 'Free',
    price: '$0/mo',
    fee: '5-7%',
    portals: '1',
    products: '25',
    team: '1',
    current: true,
  },
  {
    name: 'Growth',
    price: 'Coming Soon',
    fee: '3-4%',
    portals: '10',
    products: '100',
    team: '5',
    current: false,
  },
  {
    name: 'Professional',
    price: 'Coming Soon',
    fee: '2-3%',
    portals: '50',
    products: 'Unlimited',
    team: '15',
    current: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    fee: '1-2%',
    portals: 'Unlimited',
    products: 'Unlimited',
    team: 'Unlimited',
    current: false,
  },
];

export default function PlanStep({ onNext, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Your Plan</h2>
        <p className="mt-1 text-sm text-gray-500">
          You're on the Free plan. You can upgrade anytime as your business
          grows.
        </p>
      </div>

      {/* Current plan highlight */}
      <div className="rounded-lg border-2 border-indigo-500 bg-indigo-50 p-4">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-xs font-medium text-white">
            Current
          </span>
          <span className="text-sm font-semibold text-gray-900">Free Plan</span>
        </div>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>1 active portal</li>
          <li>25 products per portal</li>
          <li>5-7% transaction fee per order</li>
        </ul>
      </div>

      {/* Plan comparison */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left font-medium text-gray-500">
                Feature
              </th>
              {PLANS.map((p) => (
                <th
                  key={p.name}
                  className={`py-2 text-center font-medium ${
                    p.current ? 'text-indigo-600' : 'text-gray-900'
                  }`}
                >
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="py-2 text-gray-500">Monthly Price</td>
              {PLANS.map((p) => (
                <td key={p.name} className="py-2 text-center text-gray-900">
                  {p.price}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-gray-500">Transaction Fee</td>
              {PLANS.map((p) => (
                <td key={p.name} className="py-2 text-center text-gray-900">
                  {p.fee}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-gray-500">Active Portals</td>
              {PLANS.map((p) => (
                <td key={p.name} className="py-2 text-center text-gray-900">
                  {p.portals}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-gray-500">Products / Portal</td>
              {PLANS.map((p) => (
                <td key={p.name} className="py-2 text-center text-gray-900">
                  {p.products}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2 text-gray-500">Team Members</td>
              {PLANS.map((p) => (
                <td key={p.name} className="py-2 text-center text-gray-900">
                  {p.team}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
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
            disabled
            title="Coming soon"
            className="cursor-not-allowed rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-400"
          >
            Upgrade Now
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Stay on Free
          </button>
        </div>
      </div>
    </div>
  );
}
