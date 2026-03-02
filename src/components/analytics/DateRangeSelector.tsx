import type { TimeGranularity } from '../../types/analytics';

interface Props {
  startDate: string;
  endDate: string;
  granularity: TimeGranularity;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onGranularityChange: (v: TimeGranularity) => void;
}

const GRANULARITY_OPTIONS: { label: string; value: TimeGranularity }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

export default function DateRangeSelector({
  startDate,
  endDate,
  granularity,
  onStartDateChange,
  onEndDateChange,
  onGranularityChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500">From</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500">To</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        />
      </div>
      <div className="flex rounded-md border border-gray-300">
        {GRANULARITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onGranularityChange(opt.value)}
            className={`px-3 py-1 text-xs font-medium transition-colors first:rounded-l-md last:rounded-r-md ${
              granularity === opt.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
