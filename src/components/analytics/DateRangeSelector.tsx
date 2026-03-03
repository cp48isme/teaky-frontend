import type { TimeGranularity } from '../../types/analytics';

interface Props {
  granularity: TimeGranularity;
  onGranularityChange: (g: TimeGranularity) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (d: string) => void;
  onEndDateChange: (d: string) => void;
}

const GRANULARITIES: { value: TimeGranularity; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function DateRangeSelector({
  granularity,
  onGranularityChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-md border border-gray-300 bg-white">
        {GRANULARITIES.map((g) => (
          <button
            key={g.value}
            onClick={() => onGranularityChange(g.value)}
            className={`px-3 py-1.5 text-sm font-medium first:rounded-l-md last:rounded-r-md ${
              granularity === g.value
                ? 'bg-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
      />
      <span className="text-gray-500">to</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
      />
    </div>
  );
}
