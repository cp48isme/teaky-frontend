import type { OrganizationEquipment } from '../../types/equipment';

interface Props {
  equipment: OrganizationEquipment[];
}

export default function EquipmentSummary({ equipment }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Equipment</h3>
        <a
          href="/get-started"
          className="text-xs text-indigo-600 hover:text-indigo-800"
        >
          Manage
        </a>
      </div>

      {equipment.length === 0 ? (
        <p className="mt-2 text-sm text-gray-500">
          No equipment added yet.{' '}
          <a href="/get-started" className="text-indigo-600 hover:text-indigo-800">
            Add equipment
          </a>
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {equipment.map((oe) => (
            <li
              key={oe.id}
              className="flex items-center gap-2 text-sm text-gray-700"
            >
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Equipment #{oe.equipment_id.slice(0, 8)}...
              {oe.quantity > 1 && (
                <span className="text-xs text-gray-500">
                  x{oe.quantity}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
