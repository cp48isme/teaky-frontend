import { useState } from 'react';
import { uploadFile } from '../../api/uploads';
import type { ArtworkDisposition } from '../../types/cart';

export interface ArtworkDeclarationValue {
  disposition: ArtworkDisposition | null;
  note: string;
  uploadUrl: string | null;
}

interface Props {
  value: ArtworkDeclarationValue;
  onChange: (next: ArtworkDeclarationValue) => void;
  /** Smaller type and spacing for a cart row. */
  compact?: boolean;
  idPrefix: string;
}

const ARTWORK_LABELS: Record<ArtworkDisposition, string> = {
  reuse_unchanged: 'Reprint exactly as last time — no proof needed',
  changes_new_proof: 'Changes needed — a new proof will be sent before printing',
  no_artwork: 'No artwork',
};

/**
 * The buyer's artwork declaration for a proof-required product (S88): reprint
 * unchanged, or changes with a short note and an optional upload. Leaving it
 * unset lets the server decide from this hotel's order history for the product.
 */
export default function ArtworkDeclaration({ value, onChange, compact, idPrefix }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const text = compact ? 'text-xs' : 'text-sm';

  return (
    <fieldset className={`space-y-2 ${compact ? 'mt-2' : 'rounded-md border border-gray-200 p-3'}`}>
      <legend className={`${text} font-medium text-gray-700`}>Artwork</legend>
      {(['reuse_unchanged', 'changes_new_proof'] as const).map((option) => (
        <label key={option} className={`flex items-start gap-2 ${text} text-gray-700`}>
          <input
            type="radio"
            name={`${idPrefix}-artwork`}
            value={option}
            checked={value.disposition === option}
            onChange={() => onChange({ ...value, disposition: option })}
            className="mt-0.5"
          />
          <span>{ARTWORK_LABELS[option]}</span>
        </label>
      ))}
      {value.disposition === null && (
        <p className={`${text} text-gray-500`}>
          If you leave this unset, a product this hotel has ordered before is treated as an
          unchanged reprint; a first order gets a new proof.
        </p>
      )}
      {value.disposition === 'changes_new_proof' && (
        <div className="space-y-2">
          <label className={`block ${text} text-gray-700`} htmlFor={`${idPrefix}-artwork-note`}>
            What changes?
            <textarea
              id={`${idPrefix}-artwork-note`}
              value={value.note}
              onChange={(e) => onChange({ ...value, note: e.target.value })}
              maxLength={2000}
              rows={compact ? 2 : 3}
              placeholder="e.g. New phone number on the back"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teak focus:ring-1 focus:ring-teak"
            />
          </label>
          <label className={`block ${text} text-gray-700`} htmlFor={`${idPrefix}-artwork-file`}>
            New artwork file (optional)
            <input
              id={`${idPrefix}-artwork-file`}
              type="file"
              accept=".pdf,.ai,.eps,.svg,.png,.jpg,.jpeg"
              disabled={uploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setUploadError(null);
                try {
                  const uploaded = await uploadFile(file);
                  onChange({ ...value, uploadUrl: uploaded.url });
                } catch (err) {
                  setUploadError(err instanceof Error ? err.message : 'Upload failed');
                } finally {
                  setUploading(false);
                }
              }}
              className="mt-1 block w-full text-sm"
            />
          </label>
          {uploading && <p className={`${text} text-gray-500`}>Uploading…</p>}
          {value.uploadUrl && !uploading && (
            <p className={`${text} text-green-700`}>Artwork attached.</p>
          )}
          {uploadError && <p className={`${text} text-red-600`}>{uploadError}</p>}
        </div>
      )}
    </fieldset>
  );
}
