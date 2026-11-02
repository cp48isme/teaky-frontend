import type { InputHTMLAttributes } from 'react';

interface SearchBoxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value: string;
  onChange: (value: string) => void;
}

/** The search box the products grid has always had, as one component for every list (Cause 6). */
export default function SearchBox({ value, onChange, className = '', ...rest }: SearchBoxProps) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:outline-none focus:ring-teak ${className}`}
      {...rest}
    />
  );
}
