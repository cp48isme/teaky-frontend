import { useState } from 'react';

/** Tags editing (t08, 19 Nov 2026): the order's tags as chips, each with a
 * remove control; add one from the shop's list or type a new one. The same
 * control on the order page and inline on each orders row (compact). A
 * read-only reader gets the chips and nothing else. */

const chip: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500, lineHeight: '18px', background: 'var(--sg-surface-3)', color: 'var(--sg-muted-2)' };
const removeStyle: React.CSSProperties = { border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--sg-muted)', padding: 0, fontSize: 13, lineHeight: 1 };
const ctl: React.CSSProperties = { fontSize: 12, padding: '2px 6px', border: '1px solid var(--sg-line-3)', borderRadius: 4, background: 'var(--sg-surface)' };

export function nextTags(current: readonly string[], raw: string): string[] {
  const tag = raw.trim();
  if (!tag || current.includes(tag)) return [...current];
  return [...current, tag];
}

export default function TagEditor({
  tags,
  options,
  readOnly,
  busy = false,
  compact = false,
  onChange,
}: {
  tags: readonly string[];
  /** The shop's tag list; the picker offers those not already on the order. */
  options: readonly string[];
  readOnly: boolean;
  busy?: boolean;
  compact?: boolean;
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(!compact);
  const [draft, setDraft] = useState('');
  const offered = options.filter((o) => !tags.includes(o));

  function add(raw: string) {
    const next = nextTags(tags, raw);
    setDraft('');
    if (next.length !== tags.length) onChange(next);
    if (compact) setOpen(false);
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }} data-testid="tag-editor">
      {tags.map((t) => (
        <span key={t} style={chip}>
          <span data-testid="row-tag">{t}</span>
          {readOnly ? null : (
            <button type="button" aria-label={`Remove tag ${t}`} title="Remove" style={removeStyle} disabled={busy} onClick={() => onChange(tags.filter((x) => x !== t))}>
              ×
            </button>
          )}
        </span>
      ))}
      {readOnly ? null : !open ? (
        <button type="button" aria-label="Add tag" title="Add a tag" style={{ ...ctl, cursor: 'pointer', color: 'var(--sg-muted)' }} disabled={busy} onClick={() => setOpen(true)}>
          + tag
        </button>
      ) : (
        <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
          {offered.length ? (
            <select aria-label="Pick a tag" style={ctl} value="" disabled={busy} onChange={(e) => add(e.target.value)}>
              <option value="">Pick a tag…</option>
              {offered.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : null}
          <input
            aria-label="New tag"
            placeholder="New tag"
            style={{ ...ctl, width: 110 }}
            value={draft}
            maxLength={100}
            disabled={busy}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                add(draft);
              }
            }}
          />
          <button type="button" style={{ ...ctl, cursor: 'pointer' }} disabled={busy || !draft.trim()} onClick={() => add(draft)}>
            Add
          </button>
          {compact ? (
            <button type="button" aria-label="Close tag editor" style={{ ...ctl, cursor: 'pointer' }} onClick={() => setOpen(false)}>
              Done
            </button>
          ) : null}
        </span>
      )}
    </div>
  );
}
