import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPushOutPreview, pushOut } from '../../api/production';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import ProposalsPanel from '../../components/production/ProposalsPanel';
import type { PushOutPreview, PushOutResult } from '../../types/production';

/** Push-out, one decision (ruling 26 Nov 2026; overnight dispatch item 2).
 * Board 2's rule stands: never push out without a confirmation that shows the
 * files, the blanks and the Docket order first, and the confirm button stays
 * off until the payload has rendered. The page reads top to bottom as the
 * decision does: the batch's facts → the switch, above the fold, saying
 * whether this push-out is recorded or sent → what goes with it → the Docket
 * order in one line, its XML behind "Show the Docket XML" → Confirm / Not
 * now. After Confirm the result replaces the buttons. */

export function switchText(preview: Pick<PushOutPreview, 'docket_send_enabled' | 'docket_host'>): string {
  return preview.docket_send_enabled
    ? `Docket send is ON for this shop — confirming sends this order to DocketManager at ${preview.docket_host ?? 'the configured site'} and records its number on the batch.`
    : 'Docket send is OFF for this shop — confirming records this push-out on the batch; nothing is sent. (OFF — the payload is recorded, nothing is sent.)';
}

export function orderLine(preview: PushOutPreview): string {
  const p = preview.payload;
  if (!p) return `Docket order for batch ${preview.batch_number}`;
  return `Docket order for batch ${preview.batch_number} — named ${p.order_name} in Docket (item ${p.item_code})`;
}

export function resultText(result: PushOutResult): string {
  if (result.sent && result.docket_number) return `Pushed out and sent. Docket order ${result.docket_number} recorded on the batch.`;
  if (result.needs_human) return `Sent, but DocketManager's answer needs a person: ${result.reason}`;
  return `Not sent: ${result.reason}`;
}

export default function PushOutConfirmPage() {
  const { unitId = '' } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<PushOutPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [payloadRendered, setPayloadRendered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PushOutResult | null>(null);

  useEffect(() => {
    setPayloadRendered(false);
    getPushOutPreview(unitId)
      .then(setPreview)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Could not load the push-out preview'));
  }, [unitId]);

  // The payload is "rendered" once its XML is in the document — the ref
  // callback fires only when the <pre> holding it has mounted with content.
  // It sits behind a closed <details>, so it is in the document, not in view.
  const payloadRef = (node: HTMLPreElement | null) => {
    if (node && node.textContent && node.textContent.trim().length > 0) setPayloadRendered(true);
  };

  const canConfirm = Boolean(preview && preview.payload_xml && payloadRendered && !preview.existing_docket_number && !busy && !result);
  const batchHref = `/production/batches/${unitId}`;

  async function confirm() {
    if (!canConfirm) return;
    setBusy(true);
    try {
      setResult(await pushOut(unitId));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The push-out was refused');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ProductionLayout>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>{preview ? `Push out ${preview.batch_number} — confirm` : 'Push out — confirm'}</h1>
        <Link to={batchHref} style={{ marginLeft: 'auto', color: colors.vein, fontSize: 14 }} data-testid="back-to-batch-top">
          ← {preview ? `Batch ${preview.batch_number}` : 'Batch'}
        </Link>
      </div>
      {error ? (
        <div role="alert" style={{ color: 'var(--sg-danger)' }}>
          {error}
        </div>
      ) : null}
      {preview ? (
        <>
          <div style={card} data-testid="push-facts">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Fact label="Batch" value={String(preview.batch_number)} mono />
              <Fact label="Stock" value={preview.stock || 'unknown'} />
              <Fact label="Slots" value={`${preview.used} / ${preview.capacity}${preview.half ? ' · half batch' : ''}`} />
              <Fact label="Sheets per run" value={String(preview.sheets_per_run ?? 250)} />
              <Fact label="Blanks" value={String(preview.blanks)} color={preview.blanks ? 'var(--sg-warn)' : undefined} />
              <Fact label="Orders · lines" value={`${preview.orders} · ${preview.lines}`} />
            </div>
            {preview.existing_docket_number ? (
              <div style={{ color: 'var(--sg-danger)' }}>Already in DocketManager as order #{preview.existing_docket_number}; it will not be sent again.</div>
            ) : null}
          </div>
          <div
            role="status"
            data-testid="docket-switch-banner"
            data-docket-send={preview.docket_send_enabled ? 'on' : 'off'}
            style={{ ...card, flexDirection: 'row', alignItems: 'center', gap: 12, fontSize: 15, fontWeight: 500, borderColor: preview.docket_send_enabled ? colors.vein : 'var(--sg-warn-line)', background: preview.docket_send_enabled ? 'var(--sg-ok-bg)' : 'var(--sg-warn-bg-2)', color: preview.docket_send_enabled ? 'var(--sg-ok)' : 'var(--sg-warn)' }}
          >
            {switchText(preview)}
          </div>
          <div style={card} data-testid="goes-with-it">
            <div style={{ fontWeight: 500 }}>What goes with it</div>
            {preview.files.length === 0 ? <div style={{ color: 'var(--sg-muted)', fontSize: 14 }}>No files on this batch yet — the job ticket is generated on push-out; art comes with the lines.</div> : null}
            {preview.files.map((f) => (
              <div key={f.sha256 + f.filename} style={{ display: 'flex', gap: 12, fontSize: 14, alignItems: 'baseline' }}>
                <span style={{ ...lbl, width: 80 }}>{f.kind === 'job_ticket' ? 'job ticket' : f.kind}</span>
                <span style={mono}>{f.filename}</span>
                <span style={{ color: 'var(--sg-muted)' }}>{(f.size_bytes / 1024).toFixed(1)} KB</span>
                <span style={{ ...mono, color: 'var(--sg-muted)' }} title={f.sha256}>
                  {f.sha256.slice(0, 12)}…
                </span>
              </div>
            ))}
          </div>
          <div style={card} data-testid="docket-order">
            {preview.payload_problem ? (
              <div role="alert" style={{ color: 'var(--sg-danger)' }}>
                The Docket order cannot be built: {preview.payload_problem}
              </div>
            ) : preview.payload && preview.payload_xml ? (
              <>
                <div style={{ fontWeight: 500 }} data-testid="docket-order-line">{orderLine(preview)}</div>
                <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>
                  {preview.payload.pos.length} PO{preview.payload.pos.length === 1 ? '' : 's'} · {preview.payload.cards} cards · sha256 <span style={mono}>{(preview.payload_sha256 ?? '').slice(0, 16)}…</span>
                </div>
                <details data-testid="docket-xml">
                  <summary style={{ cursor: 'pointer', fontSize: 14 }}>Show the Docket XML</summary>
                  <pre ref={payloadRef} data-testid="docket-payload" style={{ ...mono, background: 'var(--sg-surface-2)', border: '1px solid var(--sg-line)', borderRadius: 6, padding: 12, overflowX: 'auto', margin: '8px 0 0', whiteSpace: 'pre-wrap' }}>
                    {preview.payload_xml}
                  </pre>
                </details>
              </>
            ) : (
              <div style={{ color: 'var(--sg-muted)' }}>Rendering the Docket order…</div>
            )}
          </div>
          {result ? (
            <div role="status" data-testid="push-result" style={{ ...card, borderColor: result.sent && result.docket_number ? colors.vein : 'var(--sg-warn-line)' }}>
              <div style={{ fontWeight: 500, color: result.needs_human ? 'var(--sg-danger)' : undefined }}>{resultText(result)}</div>
              <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>
                Payload sha256 <span style={mono}>{result.payload_sha256}</span> ·{' '}
                <Link to={`${batchHref}#audit`} style={{ color: colors.stem }} data-testid="audit-link">
                  recorded on the batch's audit trail
                </Link>
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to={batchHref} style={{ ...btn, textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center' }} data-testid="back-to-batch">
                  Back to batch {preview.batch_number}
                </Link>
                <Link to="/production/batches" style={{ ...btn, textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center' }} data-testid="back-to-batches">
                  Back to Batches
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }} data-testid="decision">
              <button type="button" onClick={confirm} disabled={!canConfirm} aria-disabled={!canConfirm} style={{ ...btn, ...(canConfirm ? btnPrimary : { opacity: 0.5, cursor: 'not-allowed' }) }}>
                {busy ? 'Pushing out…' : `Confirm — push out ${preview.batch_number}`}
              </button>
              <button type="button" onClick={() => navigate(batchHref)} style={btn}>
                Not now
              </button>
              <span style={{ fontSize: 13, color: 'var(--sg-muted)' }}>{canConfirm ? 'Nothing moves until you press confirm.' : 'The confirm button stays off until the Docket order above has rendered.'}</span>
            </div>
          )}
          {/* Held (overnight dispatch item 3, "it leaves push-out"): WalkFindingsT10 (c) asserts the panel here; its removal waits for the word on that test. */}
          <ProposalsPanel targets={[{ target_kind: 'release_unit', target_id: unitId, label: `Batch ${preview.batch_number}` }]} focusTargetId={unitId} />
        </>
      ) : !error ? (
        <div style={{ color: 'var(--sg-muted)' }}>Loading…</div>
      ) : null}
    </ProductionLayout>
  );
}

function Fact({ label, value, mono: isMono = false, color }: { label: string; value: string; mono?: boolean; color?: string }) {
  return (
    <div>
      <span style={lbl}>{label}</span>
      <div style={{ fontSize: 15, fontWeight: 500, color, ...(isMono ? mono : {}) }}>{value}</div>
    </div>
  );
}

const card: React.CSSProperties = { background: 'var(--sg-surface)', border: '1px solid var(--sg-line)', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
const lbl: React.CSSProperties = { fontSize: 12, color: 'var(--sg-muted)', textTransform: 'uppercase', letterSpacing: '.02em', display: 'block' };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid var(--sg-line-2)', background: 'var(--sg-surface)', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const btnPrimary: React.CSSProperties = { background: 'var(--sg-ok)', color: 'var(--sg-surface)', borderColor: 'var(--sg-ok)' };
