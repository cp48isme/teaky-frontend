import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPushOutPreview, pushOut } from '../../api/production';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import type { PushOutPreview, PushOutResult } from '../../types/production';

/** Board 2's rule: never push out without a confirmation that shows the
 * files, the blanks and the Docket order first. The confirm button stays
 * disabled until the payload has rendered on this screen. */

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

  // The payload is "rendered" once its XML is on screen — the ref callback
  // fires only when the <pre> holding it has mounted with content.
  const payloadRef = (node: HTMLPreElement | null) => {
    if (node && node.textContent && node.textContent.trim().length > 0) setPayloadRendered(true);
  };

  const canConfirm = Boolean(preview && preview.payload_xml && payloadRendered && !preview.existing_docket_number && !busy && !result);

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
        <Link to="/production/batches" style={{ marginLeft: 'auto', color: colors.vein, fontSize: 14 }}>
          ← Batches
        </Link>
      </div>
      {error ? (
        <div role="alert" style={{ color: '#a3331d' }}>
          {error}
        </div>
      ) : null}
      {preview ? (
        <>
          <div style={card}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Fact label="Batch" value={String(preview.batch_number)} mono />
              <Fact label="Stock" value={preview.stock || 'unknown'} />
              <Fact label="Slots" value={`${preview.used} / ${preview.capacity}${preview.half ? ' · half batch' : ''}`} />
              <Fact label="Sheets per run" value={String(preview.sheets_per_run ?? 250)} />
              <Fact label="Blanks" value={String(preview.blanks)} color={preview.blanks ? '#7a5a12' : undefined} />
              <Fact label="Orders · lines" value={`${preview.orders} · ${preview.lines}`} />
              <Fact label="Docket send" value={preview.docket_send_enabled ? `ON → ${preview.docket_host ?? 'no site configured'}` : 'OFF — the payload is recorded, nothing is sent'} color={preview.docket_send_enabled ? colors.vein : '#7a5a12'} />
            </div>
            {preview.existing_docket_number ? (
              <div style={{ color: '#a3331d' }}>Already in DocketManager as order #{preview.existing_docket_number}; it will not be sent again.</div>
            ) : null}
          </div>
          <div style={card}>
            <div style={{ fontWeight: 500 }}>Files that go with it</div>
            {preview.files.length === 0 ? <div style={{ color: '#4b5563', fontSize: 14 }}>No files on this batch yet — the job ticket is generated on the batch's ticket route; art comes with the lines.</div> : null}
            {preview.files.map((f) => (
              <div key={f.sha256 + f.filename} style={{ display: 'flex', gap: 12, fontSize: 14, alignItems: 'baseline' }}>
                <span style={{ ...lbl, width: 80 }}>{f.kind}</span>
                <span style={mono}>{f.filename}</span>
                <span style={{ color: '#4b5563' }}>{(f.size_bytes / 1024).toFixed(1)} KB</span>
                <span style={{ ...mono, color: '#4b5563' }} title={f.sha256}>
                  {f.sha256.slice(0, 12)}…
                </span>
              </div>
            ))}
          </div>
          <div style={card}>
            <div style={{ fontWeight: 500 }}>The Docket order that would be sent</div>
            {preview.payload_problem ? (
              <div role="alert" style={{ color: '#a3331d' }}>
                It cannot be built: {preview.payload_problem}
              </div>
            ) : preview.payload && preview.payload_xml ? (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 14 }}>
                  <Fact label="Order" value={preview.payload.order_name} mono />
                  <Fact label="Customer" value={`${preview.payload.customer_name} (${preview.payload.customer_id})`} />
                  <Fact label="Item" value={`${preview.payload.item_code} · ${preview.payload.item_name}`} />
                  <Fact label="POs" value={preview.payload.pos.join(' ')} mono />
                  <Fact label="Cards" value={String(preview.payload.cards)} />
                  <Fact label="sha256" value={(preview.payload_sha256 ?? '').slice(0, 16) + '…'} mono />
                </div>
                <pre ref={payloadRef} data-testid="docket-payload" style={{ ...mono, background: '#f9fafb', border: '1px solid #e1e5ea', borderRadius: 6, padding: 12, overflowX: 'auto', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {preview.payload_xml}
                </pre>
              </>
            ) : (
              <div style={{ color: '#4b5563' }}>Rendering the payload…</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={confirm}
              disabled={!canConfirm}
              aria-disabled={!canConfirm}
              style={{ ...btn, ...(canConfirm ? btnPrimary : { opacity: 0.5, cursor: 'not-allowed' }) }}
            >
              {busy ? 'Pushing out…' : `Confirm — push out ${preview.batch_number}`}
            </button>
            <button type="button" onClick={() => navigate('/production/batches')} style={btn}>
              Not now
            </button>
            <span style={{ fontSize: 13, color: '#4b5563' }}>
              {canConfirm ? 'Nothing moves until you press confirm.' : result ? '' : 'The confirm button stays off until the Docket order above has rendered.'}
            </span>
          </div>
          {result ? (
            <div role="status" style={{ ...card, borderColor: result.sent && result.docket_number ? colors.vein : '#efd9a3' }}>
              {result.sent && result.docket_number ? (
                <div>
                  Pushed out. Docket order <span style={mono}>{result.docket_number}</span> recorded on batch {preview.batch_number}.
                </div>
              ) : result.needs_human ? (
                <div style={{ color: '#a3331d' }}>Sent, but DocketManager's answer needs a person: {result.reason}</div>
              ) : (
                <div>Not sent: {result.reason}</div>
              )}
              <div style={{ fontSize: 13, color: '#4b5563' }}>Payload sha256 {result.payload_sha256} · recorded on the batch's audit trail.</div>
            </div>
          ) : null}
        </>
      ) : !error ? (
        <div style={{ color: '#4b5563' }}>Loading…</div>
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

const card: React.CSSProperties = { background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
const lbl: React.CSSProperties = { fontSize: 12, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '.02em', display: 'block' };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid #c9cfd6', background: '#fff', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const btnPrimary: React.CSSProperties = { background: '#558b2f', color: '#fff', borderColor: '#558b2f' };
