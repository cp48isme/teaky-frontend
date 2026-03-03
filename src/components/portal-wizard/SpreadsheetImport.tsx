import { useState, useRef, useCallback } from 'react';
import type { WizardProduct } from './ProductAddStep';

interface SpreadsheetImportProps {
  onImport: (products: WizardProduct[]) => void;
  onCancel: () => void;
}

interface ParsedRow {
  name: string;
  category: string;
  sku: string;
  description: string;
  min_qty: string;
  price: string;
}

const EXPECTED_COLUMNS = ['name', 'category', 'sku', 'description', 'min_qty', 'price'];

function parseCsv(text: string): ParsedRow[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  const headers = parseCsvLine(headerLine).map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));

  const columnMap: Record<string, number> = {};
  for (const col of EXPECTED_COLUMNS) {
    const idx = headers.indexOf(col);
    if (idx !== -1) {
      columnMap[col] = idx;
    }
  }

  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.every((v) => !v.trim())) continue;

    rows.push({
      name: values[columnMap['name'] ?? 0]?.trim() ?? '',
      category: values[columnMap['category'] ?? 1]?.trim() ?? '',
      sku: values[columnMap['sku'] ?? 2]?.trim() ?? '',
      description: values[columnMap['description'] ?? 3]?.trim() ?? '',
      min_qty: values[columnMap['min_qty'] ?? 4]?.trim() ?? '',
      price: values[columnMap['price'] ?? 5]?.trim() ?? '',
    });
  }

  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result;
}

export default function SpreadsheetImport({ onImport, onCancel }: SpreadsheetImportProps) {
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a .csv file');
      return;
    }

    setFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') {
        setError('Failed to read file');
        return;
      }

      const rows = parseCsv(text);
      if (rows.length === 0) {
        setError('No data rows found in CSV. Make sure the file has a header row and at least one data row.');
        return;
      }

      const validRows = rows.filter((r) => r.name.trim());
      if (validRows.length === 0) {
        setError('No rows with a product name found. Make sure there is a "name" column.');
        return;
      }

      setParsedRows(validRows);
    };
    reader.onerror = () => setError('Failed to read file');
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleImport = () => {
    const products: WizardProduct[] = parsedRows.map((row) => ({
      _tempId: crypto.randomUUID(),
      name: row.name,
      category: row.category || 'apparel',
      sku: row.sku || undefined,
      description: row.description || undefined,
      min_order_qty: parseInt(row.min_qty) || 1,
      sizes: [],
      colors: [],
      pricing_tiers: row.price
        ? [{ min_qty: 1, max_qty: null, unit_price: parseFloat(row.price) || 0 }]
        : [],
      mockup_urls: [],
    }));
    onImport(products);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Import Products from CSV</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Drop zone */}
          {parsedRows.length === 0 && (
            <>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                  dragging
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                }`}
              >
                <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm font-medium text-gray-700">
                  Drop your CSV file here or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Expected columns: name, category, sku, description, min_qty, price
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            </>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Preview table */}
          {parsedRows.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{parsedRows.length}</span> products found
                  {fileName && (
                    <span className="ml-2 text-gray-400">from {fileName}</span>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setParsedRows([]);
                    setFileName(null);
                    setError(null);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Choose different file
                </button>
              </div>

              <div className="max-h-64 overflow-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50 text-left">
                    <tr>
                      <th className="px-3 py-2 text-xs font-medium text-gray-500">Name</th>
                      <th className="px-3 py-2 text-xs font-medium text-gray-500">Category</th>
                      <th className="px-3 py-2 text-xs font-medium text-gray-500">SKU</th>
                      <th className="px-3 py-2 text-xs font-medium text-gray-500">Min Qty</th>
                      <th className="px-3 py-2 text-xs font-medium text-gray-500">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {parsedRows.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium text-gray-900">{row.name}</td>
                        <td className="px-3 py-2 text-gray-600">{row.category || '-'}</td>
                        <td className="px-3 py-2 text-gray-600 font-mono text-xs">{row.sku || '-'}</td>
                        <td className="px-3 py-2 text-gray-600">{row.min_qty || '1'}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {row.price ? `$${parseFloat(row.price).toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          {parsedRows.length > 0 && (
            <button
              type="button"
              onClick={handleImport}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Import {parsedRows.length} Product{parsedRows.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
