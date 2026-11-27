import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getBatchPage, openJobTicket } from '../../api/production';
import { listShopTags } from '../../api/orders';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import ProposalsPanel from '../../components/production/ProposalsPanel';
import BatchTagEditor from '../../components/production/BatchTagEditor';
import MarkDoneDialog, { markedDoneText } from '../../components/production/MarkDoneDialog';
import TagEditor from '../../components/production/TagEditor';
import { stateText } from '../../lib/batchesList';
import { ageText } from '../../lib/production';
import { isShadowReader } from '../../lib/roles';
import { NO_FLOOR_ROLE, isNoFloorRole, loadFailureText } from '../../lib/productionAccess';
import type { BatchPage as BatchPageFacts, BatchPageAuditEntry, BatchPageFile } from '../../types/batchPage';
import type { BatchSummary } from '../../types/production';

/** The batch page (overnight dispatch, 26 Nov 2026, item 1): the one place a
 * batch is understood. Top: the row's facts. Then the lines, each linking to
 * its order. Then what goes with it — the job ticket, the imposed sheet, the
 * art — never a sentence about absence with no action. Then the actions,
 * each saying what it does and where it leads. Then this batch's proposals,
 * waiting first. Then the audit trail, newest first. */

export const PUSH_OUT_BLOCKED_STATES = new Set(['releasing', 'released']);

export function pushable(b: BatchSummary): boolean {
  return !b.cancelled && !b.marked_done_at && !b.docket_number && !PUSH_OUT_BLOCKED_STATES.has(b.release_state ?? '') && b.used > 0;
}

export function laneText(lane: string | null): string {
  if (!lane) return '—';
  return lane === 'stocked_goods' ? 'Stocked goods' : lane === 'press_run' ? 'Press run' : lane;
}

export function artText(withArt: number, lines: number): string {
  if (lines === 0) return 'No lines in this batch yet.';
  return withArt === lines ? `${withArt} of ${lines} line${lines === 1 ? '' : 's'} ${lines === 1 ? 'has' : 'have'} art` : `${withArt} of ${lines} line${lines === 1 ? '' : 's'} ${withArt === 1 ? 'has' : 'have'} art — ${lines - withArt} without; art comes with the line from its channel, or is held on All Channel Orders`;
}

export function auditText(entry: BatchPageAuditEntry): string {
  const words = entry.action.replace(/_/g, ' ');
  const d = entry.details ?? {};
  const extras: string[] = [];
  for (const key of ['outcome', 'docket_number', 'reason', 'step', 'scan', 'tag', 'tags'] as const) {
    const v = d[key];
    if (v == null || v === '') continue;
    extras.push(`${key.replace(/_/g, ' ')}: ${Array.isArray(v) ? v.join(', ') : String(v)}`);
  }
  return extras.length ? `${words} · ${extras.join(' · ')}` : words;
}

export default function BatchPage({ readOnly = isShadowReader() }: { readOnly?: boolean } = {}) {
  const { unitId = '' } = useParams();
  const navigate = useNavigate();
  const [facts, setFacts] = useState<BatchPageFacts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noRole, setNoRole] = useState(false);
  const [shopTags, setShopTags] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [refusal, setRefusal] = useState<string | null>(null);
  const [markingDone, setMarkingDone] = useState(false);
  const [ticketBusy, setTicketBusy] = useState(false);

  const load = useCallback(() => {
    return getBatchPage(unitId)
      .then(setFacts)
      .catch((e: unknown) => (isNoFloorRole(e) ? setNoRole(true) : setError(loadFailureText(e, 'Could not load the batch'))));
  }, [unitId]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (readOnly) return;
    listShopTags()
      .then((l) => setShopTags(l.tags))
      .catch(() => setShopTags([]));
  }, [readOnly]);

  const b = facts?.summary ?? null;
  const title = b ? `Batch ${b.batch_number}` : 'Batch';
  const waiting = useMemo(() => (facts ? facts.audit : []), [facts]);

  async function showTicket() {
    setTicketBusy(true);
    setRefusal(null);
    try {
      await openJobTicket(unitId);
      await load();
    } catch (e: unknown) {
      setRefusal(e instanceof Error ? e.message : 'The job ticket could not be fetched');
    } finally {
      setTicketBusy(false);
    }
  }

  return (
    <ProductionLayout readOnly={readOnly}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }} data-testid="batch-title">{title}</h1>
        {b ? <span style={{ color: stateColor(b), fontSize: 14 }} data-testid="batch-state">{stateText(b)}</span> : null}
        <Link to="/production/batches" style={{ marginLeft: 'auto', color: colors.vein, fontSize: 14 }}>
          ← Batches
        </Link>
      </div>
      {error ? <div role="alert" style={{ color: 'var(--sg-danger)' }}>{error}</div> : null}
      {noRole ? <div role="status" style={{ color: 'var(--sg-muted)' }} data-testid="no-floor-role">{NO_FLOOR_ROLE}</div> : null}
      {!facts && !error && !noRole ? <div style={{ color: 'var(--sg-muted)' }}>Loading…</div> : null}
      {facts && b ? (
        <>
          <section style={card} aria-label="Batch facts" data-testid="batch-facts">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
              <Fact label="Batch" value={String(b.batch_number)} mono />
              <Fact label="Scan code" value={b.scan_code || '—'} mono testId="scan-code" />
              <Fact label="Stock" value={b.stock || 'unknown'} />
              <Fact label="Slots" value={`${b.used} / ${b.capacity}${b.half ? ' · half' : ''}${b.blanks ? ` · ${b.blanks} blank` : ''}`} />
              <Fact label="Orders · lines" value={`${b.orders} · ${b.lines}`} />
              <Fact label="Oldest line" value={b.oldest_line_age_seconds != null ? `${ageText(b.oldest_line_age_seconds)} · ${b.oldest_line_ref ?? ''}` : '—'} />
              <Fact label="Entity" value={(b.business_entities ?? []).join(', ') || '—'} testId="entity" />
              <div>
                <span style={lbl}>Tags</span>
                <div data-testid="batch-tags">{readOnly ? <TagEditor tags={b.tags ?? []} options={[]} readOnly compact onChange={() => undefined} /> : <BatchTagEditor batch={b} options={shopTags} onWritten={() => void load()} />}</div>
              </div>
              <Fact label="State" value={stateText(b)} color={stateColor(b)} />
            </div>
          </section>

          <section style={card} aria-labelledby="lines-heading">
            <h2 id="lines-heading" style={h2}>Lines</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }} data-testid="batch-lines">
                <thead>
                  <tr>
                    {['PO', 'Product', 'Quantity', 'Lane', 'Art'].map((h) => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {facts.lines.map((line) => (
                    <tr key={line.line_item_id} data-testid="batch-line">
                      <td style={{ ...td, ...mono }}>
                        <Link to={`/orders/${line.order_id}`} style={{ color: colors.stem }}>{line.order_ref}</Link>
                        {line.customer ? <span style={{ color: 'var(--sg-muted)', marginLeft: 8, fontFamily: 'inherit' }}>{line.customer}</span> : null}
                      </td>
                      <td style={td}>{line.product}</td>
                      <td style={td}>{line.quantity}{line.pack_size > 1 ? ` × ${line.pack_size} = ${line.cards}` : ''}</td>
                      <td style={td} data-testid="lane">{laneText(line.lane)}</td>
                      <td style={td} data-testid="art">{line.art_files ? `${line.art_files} file${line.art_files === 1 ? '' : 's'}` : 'none'}</td>
                    </tr>
                  ))}
                  {facts.lines.length === 0 ? (
                    <tr>
                      <td style={td} colSpan={5}>No lines in this batch.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section style={card} aria-labelledby="with-heading" data-testid="goes-with-it">
            <h2 id="with-heading" style={h2}>What goes with it</h2>
            <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
              <Row label="Job ticket">
                {facts.job_ticket ? (
                  <>
                    <FileText file={facts.job_ticket} />
                    {readOnly ? null : (
                      <button type="button" onClick={showTicket} disabled={ticketBusy} style={btnSmall} data-testid="open-ticket">
                        Open the ticket (PDF, new tab)
                      </button>
                    )}
                  </>
                ) : readOnly ? (
                  <span>Generated on push-out.</span>
                ) : (
                  <>
                    <span>Not generated yet — it is generated on push-out, or now:</span>
                    <button type="button" onClick={showTicket} disabled={ticketBusy} style={btnSmall} data-testid="open-ticket">
                      Generate and open the ticket (PDF, new tab)
                    </button>
                  </>
                )}
              </Row>
              <Row label="Imposed sheet">{facts.sheet ? <FileText file={facts.sheet} /> : <span>Imposed on push-out.</span>}</Row>
              <Row label="Art">
                <span data-testid="art-summary">{artText(facts.lines_with_art, facts.lines.length)}</span>
                {facts.lines_with_art < facts.lines.length ? (
                  <Link to="/production/orders" style={{ color: colors.stem }}>
                    Open All Channel Orders →
                  </Link>
                ) : null}
              </Row>
            </div>
          </section>

          {readOnly ? null : (
            <section style={card} aria-labelledby="actions-heading" data-testid="batch-actions">
              <h2 id="actions-heading" style={h2}>Actions</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {pushable(b) ? (
                  <button type="button" onClick={() => navigate(`/production/batches/${unitId}/push-out`)} style={{ ...btn, ...(b.full ? btnPrimary : {}) }} data-testid="push-out">
                    Push out → confirm page
                  </button>
                ) : null}
                {!b.cancelled && !b.marked_done_at ? (
                  <button type="button" onClick={() => setMarkingDone(true)} style={btn} data-testid="mark-done">
                    Mark done… → its confirmation
                  </button>
                ) : null}
                {pushable(b) && !b.half ? (
                  <a href="#proposals" style={{ ...btn, textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center' }} data-testid="propose-short-run">
                    Propose a short run → the proposal form, below
                  </a>
                ) : null}
              </div>
              {notice ? <div role="status" data-testid="action-result" style={{ color: 'var(--sg-ok-2)', fontSize: 14 }}>{notice}</div> : null}
              {refusal ? <div role="alert" data-testid="action-refusal" style={{ background: 'var(--sg-danger-bg-2)', border: '1px solid var(--sg-danger-line)', color: 'var(--sg-danger)', borderRadius: 6, padding: '10px 12px', fontSize: 14 }}>Refused: {refusal}</div> : null}
            </section>
          )}
          {markingDone ? (
            <MarkDoneDialog
              batch={b}
              onApplied={async (result) => {
                setMarkingDone(false);
                setNotice(markedDoneText(b.batch_number, result));
                await load();
              }}
              onRefused={(reason) => {
                setMarkingDone(false);
                setRefusal(reason);
              }}
              onCancel={() => setMarkingDone(false)}
            />
          ) : null}

          <ProposalsPanel targets={pushable(b) || !b.marked_done_at ? [{ target_kind: 'release_unit', target_id: unitId, label: `Batch ${b.batch_number}` }] : []} readOnly={readOnly} focusTargetId={unitId} />

          <section style={card} aria-labelledby="audit-heading" data-testid="batch-audit">
            <h2 id="audit-heading" style={h2}>Audit trail</h2>
            {waiting.length === 0 ? <div style={{ color: 'var(--sg-muted)', fontSize: 14 }}>Nothing recorded on this batch yet.</div> : null}
            <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6, fontSize: 14 }}>
              {waiting.map((entry) => (
                <li key={entry.id} data-testid="audit-entry" style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                  <span style={{ ...mono, color: 'var(--sg-muted)', whiteSpace: 'nowrap' }}>{new Date(entry.timestamp).toLocaleString('en-US')}</span>
                  <span>{auditText(entry)}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      ) : null}
    </ProductionLayout>
  );
}

function stateColor(b: BatchSummary): string | undefined {
  if (b.cancelled || b.release_state === 'needs_human' || b.release_state === 'retryable') return 'var(--sg-danger)';
  if (b.release_state === 'releasing') return 'var(--sg-warn)';
  return undefined;
}

function Fact({ label, value, mono: isMono = false, color, testId }: { label: string; value: string; mono?: boolean; color?: string; testId?: string }) {
  return (
    <div>
      <span style={lbl}>{label}</span>
      <div style={{ fontSize: 16, fontWeight: 500, color, ...(isMono ? mono : {}) }} data-testid={testId}>{value}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <span style={{ ...lbl, width: 110 }}>{label}</span>
      {children}
    </div>
  );
}

function FileText({ file }: { file: BatchPageFile }) {
  return (
    <span>
      <span style={mono}>{file.filename}</span> <span style={{ color: 'var(--sg-muted)' }}>· {(file.size_bytes / 1024).toFixed(1)} KB · {new Date(file.generated_at).toLocaleString('en-US')}</span>
    </span>
  );
}

const card: React.CSSProperties = { background: 'var(--sg-surface)', border: '1px solid var(--sg-line)', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
const h2: React.CSSProperties = { margin: 0, fontSize: 17, fontWeight: 600 };
const lbl: React.CSSProperties = { fontSize: 12, color: 'var(--sg-muted)', textTransform: 'uppercase', letterSpacing: '.02em', display: 'block' };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };
const th: React.CSSProperties = { textAlign: 'left', fontSize: 12, color: 'var(--sg-muted)', padding: '8px 10px', borderBottom: '1px solid var(--sg-line-3)', textTransform: 'uppercase', letterSpacing: '.02em', whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '10px 10px', borderBottom: '1px solid var(--sg-line)', fontSize: 14, verticalAlign: 'top' };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid var(--sg-line-2)', background: 'var(--sg-surface)', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const btnSmall: React.CSSProperties = { ...btn, minHeight: 36, padding: '6px 12px', fontSize: 13 };
const btnPrimary: React.CSSProperties = { background: colors.vein, color: 'var(--sg-surface)', borderColor: colors.vein };
