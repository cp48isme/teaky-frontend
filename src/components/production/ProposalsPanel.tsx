import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { approveProposal, declineProposal, listProposals, proposeAction } from '../../api/proposals';
import { listMembers } from '../../api/team';
import { colors } from './ProductionLayout';
import { ageText, ageSeconds } from '../../lib/production';
import { currentUserId } from '../../lib/roles';
import { NO_FLOOR_ROLE, isNoFloorRole, loadFailureText } from '../../lib/productionAccess';
import { KIND_LABEL, factsText, refusalWords, targetWords } from '../../lib/proposalsCopy';
import type { ActionProposal, ActionProposalKind, ActionProposalTarget, PushAloneReason } from '../../types/proposals';
import ActionResult from './ActionResult';

/** The four proposal actions of #259 on the screens Andrew has (dispatch
 * 17–18 Nov 2026, item 1): propose with a reason, approve, decline (or
 * withdraw one's own under the shop's second-approver switch), each showing
 * the facts the proposal carries and who proposed it. "Mark done" sits behind
 * a second confirmation on both the proposal and the approval. Approve is not
 * release: a short run still goes through the push-out confirmation.
 *
 * Role-gated as the API is: every proposals route is production:rules, so a
 * read-only sign-in (shadow_reader) fetches nothing here and sees no action. */

export interface ProposalTarget {
  target_kind: ActionProposalTarget;
  target_id: string;
  label: string;
}

const KINDS_FOR: Record<ActionProposalTarget, ActionProposalKind[]> = {
  release_unit: ['push_short_run', 'mark_done'],
  order: ['push_alone', 'void_order', 'mark_done'],
};

const CATEGORIES: PushAloneReason[] = ['rush', 'stock', 'finishing', 'other'];

const STATUS_PILL: Record<ActionProposal['status'], { background: string; color: string; text: string }> = {
  proposed: { background: 'var(--sg-warn-bg)', color: 'var(--sg-warn)', text: 'proposed — waiting for a decision' },
  approved: { background: 'var(--sg-ok-bg)', color: 'var(--sg-ok)', text: 'approved and applied' },
  declined: { background: 'var(--sg-pill)', color: 'var(--sg-muted-2)', text: 'declined' },
  withdrawn: { background: 'var(--sg-pill)', color: 'var(--sg-muted-2)', text: 'withdrawn by the proposer' },
  failed: { background: 'var(--sg-danger-bg)', color: 'var(--sg-danger)', text: 'approved, but the action refused' },
};

const card: React.CSSProperties = { background: 'var(--sg-surface)', border: '1px solid var(--sg-line)', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
const lbl: React.CSSProperties = { fontSize: 12, color: 'var(--sg-muted)', textTransform: 'uppercase', letterSpacing: '.02em' };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid var(--sg-line-2)', background: 'var(--sg-surface)', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const primary: React.CSSProperties = { ...btn, background: colors.vein, color: 'var(--sg-surface)', borderColor: colors.vein };
const danger: React.CSSProperties = { ...btn, borderColor: 'var(--sg-danger)', color: 'var(--sg-danger)' };
const tabStyle = (selected: boolean): React.CSSProperties => ({ padding: '10px 14px', minHeight: 44, font: 'inherit', fontWeight: selected ? 600 : 500, cursor: 'pointer', background: 'transparent', border: 'none', borderBottom: `2px solid ${selected ? colors.vein : 'transparent'}`, color: selected ? 'inherit' : 'var(--sg-muted)', marginBottom: -1 });
const field: React.CSSProperties = { padding: '9px 10px', border: '1px solid var(--sg-line-2)', borderRadius: 6, font: 'inherit', minHeight: 44, background: 'var(--sg-surface)' };
const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'var(--sg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 };
const dialogBox: React.CSSProperties = { ...card, maxWidth: 560, width: '100%', boxShadow: '0 12px 32px var(--sg-shadow)' };
const pill: React.CSSProperties = { display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 500 };

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={lbl}>{label}</span>
      <div style={{ fontSize: 14 }}>{value || '—'}</div>
    </div>
  );
}

function ProposalCard({
  proposal,
  who,
  me,
  busy,
  onApprove,
  onDecline,
  readOnly = false,
  refusal,
}: {
  proposal: ActionProposal;
  who: (id: string | null) => string;
  me: string | null;
  busy: boolean;
  onApprove: (note: string) => void;
  onDecline: (note: string) => void;
  readOnly?: boolean;
  /** a27 item 1 (20 Nov 2026): the server's reason when this card's last decision was refused — shown on the card, not only at the top of the panel. */
  refusal?: string;
}) {
  const [note, setNote] = useState('');
  const [confirmDone, setConfirmDone] = useState(false);
  const open = proposal.status === 'proposed';
  const mine = Boolean(me && proposal.proposed_by === me);
  const status = STATUS_PILL[proposal.status];
  return (
    <div style={card} data-testid={`proposal-${proposal.kind}`} data-status={proposal.status}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600 }} data-testid="proposal-title">
          {KIND_LABEL[proposal.kind]} for {targetWords(proposal.facts)}
        </span>
        <span style={{ marginLeft: 'auto', ...pill, background: status.background, color: status.color }}>{status.text}</span>
      </div>
      <div style={{ fontSize: 14 }}>
        <span style={{ color: 'var(--sg-muted)' }}>Proposed by</span> <span data-testid="proposed-by">{who(proposal.proposed_by)}</span>{' '}
        <span style={{ color: 'var(--sg-muted)' }}>· {ageText(ageSeconds(proposal.proposed_at))} ago</span>
        {proposal.category ? <span style={{ color: 'var(--sg-muted)' }}> · {proposal.category}</span> : null}
      </div>
      <div style={{ fontSize: 14 }}>
        <span style={lbl}>Reason</span>
        <div data-testid="proposal-reason">{proposal.reason}</div>
        {proposal.note ? <div style={{ color: 'var(--sg-muted)' }}>{proposal.note}</div> : null}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px 16px' }} data-testid="proposal-facts">
        {factsText(proposal).map((f) => (
          <Fact key={f.label} label={f.label} value={f.value} />
        ))}
        <Fact label="Facts as of" value={new Date(proposal.facts.captured_at).toLocaleString('en-US')} />
      </div>
      {!open ? (
        <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>
          {proposal.status === 'withdrawn' ? 'Withdrawn' : 'Decided'} by {who(proposal.decided_by)}
          {proposal.decided_at ? ` · ${new Date(proposal.decided_at).toLocaleString('en-US')}` : ''}
          {proposal.decision_note ? ` · ${proposal.decision_note}` : ''}
          {proposal.failure && !refusal ? <div style={{ color: 'var(--sg-danger)' }}>The action refused: {proposal.failure}</div> : null}
        </div>
      ) : readOnly ? (
        <div style={{ fontSize: 13, color: 'var(--sg-muted)' }} data-testid="waiting-for-a-decision">
          Waiting for a decision by a staff member.
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <input aria-label="Decision note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="a note on the decision (optional)" style={{ ...field, flex: '1 1 220px' }} />
          {proposal.kind === 'mark_done' && !confirmDone ? (
            <button type="button" disabled={busy} onClick={() => setConfirmDone(true)} style={primary} data-testid="approve-first">
              Approve…
            </button>
          ) : proposal.kind === 'mark_done' ? (
            <span style={{ ...pill, background: 'var(--sg-warn-bg-2)', color: 'var(--sg-warn)' }} data-testid="awaiting-confirmation">
              awaiting your confirmation
            </span>
          ) : (
            <button type="button" disabled={busy} onClick={() => onApprove(note)} style={primary} data-testid="approve">
              {proposal.kind === 'push_short_run' ? 'Approve (then confirm the push-out)' : 'Approve and apply'}
            </button>
          )}
          <button type="button" disabled={busy} onClick={() => onDecline(note)} style={danger} data-testid="decline">
            {mine ? 'Withdraw' : 'Decline'}
          </button>
          {proposal.kind === 'mark_done' && confirmDone ? (
            // Ruling 20 Nov 2026 (a27, batch 101): the second step is a modal that names the batch; the card says it waits until confirmed.
            <div role="dialog" aria-modal="true" aria-label={`Mark ${targetWords(proposal.facts)} done?`} style={overlay} data-testid="mark-done-dialog">
              <div style={dialogBox}>
                <div style={{ fontSize: 18, fontWeight: 600 }}>Mark {targetWords(proposal.facts)} done?</div>
                <div style={{ fontSize: 14, color: 'var(--sg-danger)' }} data-testid="approve-confirm-note">
                  Approving marks {targetWords(proposal.facts)} done: every remaining route step is skipped by a person, with this reason kept. Nothing is printed by it.
                </div>
                <div style={{ fontSize: 14 }}>
                  <span style={lbl}>Reason</span>
                  <div>{proposal.reason}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button type="button" disabled={busy} onClick={() => onApprove(note)} style={primary} data-testid="approve">
                    Yes, mark {targetWords(proposal.facts)} done — skip the remaining steps
                  </button>
                  <button type="button" disabled={busy} onClick={() => setConfirmDone(false)} style={btn} data-testid="approve-cancel">
                    Not now
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
      {refusal ? <ActionResult kind="refused" testId="card-refusal">Refused: {refusal}</ActionResult> : null}
    </div>
  );
}

function ProposeForm({ targets, preselect, busy, refusal, onPropose }: { targets: ProposalTarget[]; preselect?: string; busy: boolean; /** The server's answer to the last propose, in words, shown beside the button (dispatch 27 Nov 2026 evening, A). */ refusal?: string; onPropose: (body: { kind: ActionProposalKind; target: ProposalTarget; reason: string; category?: PushAloneReason; note: string }) => void }) {
  const [chosenTargetKey, setTargetKey] = useState(targets[0] ? targetKey(targets[0].target_kind, targets[0].target_id) : '');
  // The pre-filled target takes the form once its list holds it (the targets arrive with the page's data).
  useEffect(() => {
    if (preselect && targets.some((t) => targetKey(t.target_kind, t.target_id) === preselect)) setTargetKey(preselect);
  }, [preselect, targets]);
  const target = targets.find((t) => targetKey(t.target_kind, t.target_id) === chosenTargetKey) ?? targets[0] ?? null;
  const kinds = target ? KINDS_FOR[target.target_kind] : [];
  const [chosenKind, setKind] = useState<ActionProposalKind>(kinds[0] ?? 'mark_done');
  // The chosen action, or the target kind's first when the target changed under it.
  const kind: ActionProposalKind = kinds.includes(chosenKind) ? chosenKind : (kinds[0] ?? 'mark_done');
  const [reason, setReason] = useState('');
  const [category, setCategory] = useState<PushAloneReason>('rush');
  const [note, setNote] = useState('');
  const [confirmDone, setConfirmDone] = useState(false);
  const ready = Boolean(target) && reason.trim().length >= 3;
  function submit() {
    if (!target || !ready) return;
    if (kind === 'mark_done' && !confirmDone) {
      setConfirmDone(true);
      return;
    }
    onPropose({ kind, target, reason: reason.trim(), category: kind === 'push_alone' ? category : undefined, note: note.trim() });
    setReason('');
    setNote('');
    setConfirmDone(false);
  }
  if (!targets.length) return <div style={{ color: 'var(--sg-muted)', fontSize: 14 }}>Nothing on this screen to propose an action for.</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} data-testid="propose-form">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
          For
          <select aria-label="Proposal target" value={target ? targetKey(target.target_kind, target.target_id) : ''} onChange={(e) => { setTargetKey(e.target.value); setConfirmDone(false); }} style={field}>
            {targets.map((t) => (
              <option key={targetKey(t.target_kind, t.target_id)} value={targetKey(t.target_kind, t.target_id)}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
          Action
          <select aria-label="Proposed action" value={kind} onChange={(e) => { setKind(e.target.value as ActionProposalKind); setConfirmDone(false); }} style={field}>
            {kinds.map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </label>
        {kind === 'push_alone' ? (
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
            Because
            <select aria-label="Push-alone category" value={category} onChange={(e) => setCategory(e.target.value as PushAloneReason)} style={field}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      <textarea aria-label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why — in your words; the ledger keeps them (required)" rows={2} style={{ ...field, minHeight: 60, resize: 'vertical' }} />
      <input aria-label="Note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="anything else (optional)" style={field} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <button type="button" disabled={busy || !ready} onClick={submit} style={primary} data-testid="propose">
          {kind === 'mark_done' && confirmDone ? 'Yes, propose mark done' : kind === 'mark_done' ? 'Propose mark done…' : 'Propose'}
        </button>
        {kind === 'mark_done' && confirmDone ? (
          <span style={{ fontSize: 13, color: 'var(--sg-danger)' }} data-testid="propose-confirm-note">
            Mark done skips every remaining route step for {target?.label}. Nothing is applied until a person approves the proposal.
          </span>
        ) : (
          <span style={{ fontSize: 13, color: 'var(--sg-muted)' }}>Nothing happens on propose. A person approves it; a short run still goes through the push-out confirmation.</span>
        )}
      </div>
      {refusal ? (
        <ActionResult kind="refused" compact testId="propose-refusal">
          {refusal}
        </ActionResult>
      ) : null}
    </div>
  );
}

/** Where a proposal for this target is approved or declined: the Proposals
 * section of the Batches page — one home (overnight dispatch 26 Nov 2026,
 * item 3): every open proposal of the shop is decided there, orders included. */
export function approvalHref(_target_kind: ActionProposalTarget): string {
  return '/production/batches#proposals';
}

/** The key the propose form selects a target by. */
export function targetKey(target_kind: ActionProposalTarget, target_id: string): string {
  return `${target_kind}:${target_id}`;
}

/** Ruling 27 Nov 2026: a "Propose…" link on a held order (or anywhere else)
 * opens the form on the Batches page already filled in for it — nobody finds
 * the order again in a dropdown. The Batches page reads `propose` and hands
 * it to the panel as `preselectTargetKey`. */
export function proposeHref(target_kind: ActionProposalTarget, target_id: string): string {
  return `/production/batches?propose=${encodeURIComponent(targetKey(target_kind, target_id))}#proposals`;
}

export default function ProposalsPanel({ targets, readOnly = false, focusTargetId, preselectTargetKey }: { targets: ProposalTarget[]; readOnly?: boolean; /** t10 c (23 Nov 2026): inside a batch, the list opens on that batch's proposals. */ focusTargetId?: string; /** The form's target on arrival (`kind:id`), from a "Propose…" link. */ preselectTargetKey?: string }) {
  const location = useLocation();
  const navigate = useNavigate();
  // A link that ends in #proposals lands on the panel, not the top of the page.
  useEffect(() => {
    if (location.hash === '#proposals') document.getElementById('proposals')?.scrollIntoView?.({ block: 'start' });
  }, [location.hash]);
  const [proposals, setProposals] = useState<ActionProposal[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [noRole, setNoRole] = useState(false);
  const [notice, setNotice] = useState<ReactNode | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  // t10 f (23 Nov 2026): the list filtered by action and by batch or order.
  const [kindFilter, setKindFilter] = useState<'all' | ActionProposalKind>('all');
  const [targetFilter, setTargetFilter] = useState<string>(focusTargetId ?? 'all');
  const [showDecided, setShowDecided] = useState(false);
  // a27 item 1 (20 Nov 2026): a refused decision stays in front of the person — the reason on its card, and the card not hidden behind the decided toggle this session.
  const [refusals, setRefusals] = useState<Record<string, string>>({});
  const [recent, setRecent] = useState<string[]>([]);
  const me = useMemo(() => currentUserId(), []);

  const load = useCallback(async () => {
    setProposals(await listProposals());
  }, []);

  useEffect(() => {
    load().catch((e: unknown) => (isNoFloorRole(e) ? setNoRole(true) : setError(loadFailureText(e, 'Could not load the proposals'))));
    // The team list is staff-only; a read-only sign-in shows "a staff member" instead of a name.
    if (readOnly) return;
    listMembers()
      .then((members) => setNames(Object.fromEntries(members.map((m) => [m.user_id, m.display_name || m.email]))))
      .catch(() => setNames({}));
  }, [load, readOnly]);

  const who = useCallback(
    (id: string | null) => (id ? names[id] ?? 'a staff member' : 'the system'),
    [names, readOnly],
  );

  // A refusal is shown beside the button that was pressed — on the form for a
  // propose, on the card for a decision — in words (dispatch 27 Nov 2026
  // evening, A); the panel's top alert is for a load that failed.
  async function run(key: string, fn: () => Promise<unknown>, done: ReactNode, target?: ProposalTarget): Promise<boolean> {
    setBusy(key);
    setNotice(null);
    setRefusals((m) => (key in m ? Object.fromEntries(Object.entries(m).filter(([k]) => k !== key)) : m));
    try {
      await fn();
      setNotice(done);
      // One home (overnight dispatch 26 Nov 2026, item 3): a decision shows on
      // the card in place — the card stays where it was, now wearing its
      // status, instead of vanishing behind the decided toggle.
      if (key !== 'propose') setRecent((r) => (r.includes(key) ? r : [...r, key]));
      await load();
      return true;
    } catch (e: unknown) {
      const reason = refusalWords(e instanceof Error ? e.message : 'Refused', target);
      setRefusals((m) => ({ ...m, [key]: reason }));
      setRecent((r) => (r.includes(key) ? r : [...r, key]));
      await load().catch(() => undefined);
      return false;
    } finally {
      setBusy(null);
    }
  }

  // t10 c: the notice after a propose names where the decision is made and links there.
  function proposedNotice(kind: ActionProposalKind, target: ProposalTarget): ReactNode {
    const href = approvalHref(target.target_kind);
    const here = location.pathname === href.split('#')[0];
    return (
      <>
        {KIND_LABEL[kind]} proposed for {target.label}; nothing is applied until a person approves it.{' '}
        <Link to={href} data-testid="approve-where" style={{ color: 'inherit', fontWeight: 500 }}>
          Approve or decline it under Proposals {here ? 'below' : 'on the Batches page'}
        </Link>
        .
      </>
    );
  }

  // t10 d: a mark done applied from another page returns to Batches, the notice with it.
  function afterApproved(p: ActionProposal, done: string) {
    if (p.kind === 'mark_done' && location.pathname !== '/production/batches') navigate('/production/batches', { state: { notice: done } });
  }

  const byFilter = (p: ActionProposal) => (kindFilter === 'all' || p.kind === kindFilter) && (targetFilter === 'all' || p.target_id === targetFilter);
  const open = proposals.filter((p) => (p.status === 'proposed' || recent.includes(p.id)) && byFilter(p));
  const decided = proposals.filter((p) => p.status !== 'proposed' && !recent.includes(p.id) && byFilter(p));
  const kindsPresent = Array.from(new Set(proposals.map((p) => p.kind)));
  const targetsPresent = Array.from(new Map(proposals.map((p) => [p.target_id, targetWords(p.facts)])).entries());
  return (
    <section aria-labelledby="proposals" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} data-testid="proposals-panel">
      <div>
        <h2 id="proposals" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Proposals</h2>
        <div style={{ color: 'var(--sg-muted)', fontSize: 14 }}>
          {open.length} waiting for a decision · {decided.length} decided. An action is proposed with a reason and the facts present, and applied only when a person approves it.
        </div>
      </div>
      {error ? <ActionResult kind="refused">{error}</ActionResult> : null}
      {noRole ? <div role="status" style={{ color: 'var(--sg-muted)' }} data-testid="no-floor-role">{NO_FLOOR_ROLE}</div> : null}
      {notice ? <ActionResult kind="done">{notice}</ActionResult> : null}
      {readOnly ? (
        <div style={{ fontSize: 13, color: 'var(--sg-muted)' }} data-testid="proposals-read-only-note">
          Read-only: proposals are shown as staff see them; proposing and deciding are staff actions.
        </div>
      ) : (
      <div style={card}>
        <div style={{ fontWeight: 500 }}>Propose an action</div>
        <ProposeForm
          targets={targets}
          preselect={preselectTargetKey}
          busy={busy !== null}
          refusal={refusals.propose}
          onPropose={({ kind, target, reason, category, note }) =>
            run(
              'propose',
              () => proposeAction({ kind, target_kind: target.target_kind, target_id: target.target_id, reason, category, note }),
              proposedNotice(kind, target),
              target,
            )
          }
        />
      </div>
      )}
      {proposals.length ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', fontSize: 14 }} data-testid="proposal-filters">
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Action
            <select aria-label="Filter by action" value={kindFilter} onChange={(e) => setKindFilter(e.target.value as 'all' | ActionProposalKind)} style={field}>
              <option value="all">Every action</option>
              {kindsPresent.map((k) => (
                <option key={k} value={k}>
                  {KIND_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            For
            <select aria-label="Filter by batch or order" value={targetFilter} onChange={(e) => setTargetFilter(e.target.value)} style={field}>
              <option value="all">Every batch and order</option>
              {targetsPresent.map(([id, reference]) => (
                <option key={id} value={id}>
                  {reference}
                </option>
              ))}
            </select>
          </label>
          {targetFilter !== 'all' || kindFilter !== 'all' ? (
            <span style={{ color: 'var(--sg-muted)' }}>
              {open.length} waiting · {decided.length} decided in this view
            </span>
          ) : null}
        </div>
      ) : null}
      {proposals.length ? (
        // Ruling 27 Nov 2026: two tabs, Waiting and Decided, in place of the
        // "Show N decided" toggle. A proposal decided this session stays on
        // Waiting, wearing its decision (one home, item 3).
        <div role="tablist" aria-label="Proposals by state" data-testid="proposal-tabs" style={{ display: 'flex', gap: 4, borderBottom: '1px solid var(--sg-line-3)' }}>
          <button type="button" role="tab" aria-selected={!showDecided} onClick={() => setShowDecided(false)} style={tabStyle(!showDecided)} data-testid="tab-waiting">
            Waiting ({open.length})
          </button>
          <button type="button" role="tab" aria-selected={showDecided} onClick={() => setShowDecided(true)} style={tabStyle(showDecided)} data-testid="tab-decided">
            Decided ({decided.length})
          </button>
        </div>
      ) : null}
      {proposals.length && !showDecided && !open.length ? <div style={{ color: 'var(--sg-muted)', fontSize: 14 }} data-testid="tab-empty">Nothing is waiting for a decision in this view.</div> : null}
      {proposals.length && showDecided && !decided.length ? <div style={{ color: 'var(--sg-muted)', fontSize: 14 }} data-testid="tab-empty">Nothing decided in this view.</div> : null}
      {(showDecided ? [] : open).map((p) => (
        <ProposalCard
          key={p.id}
          refusal={refusals[p.id]}
          proposal={p}
          who={who}
          me={me}
          readOnly={readOnly}
          busy={busy === p.id}
          onApprove={(note) => {
            const done = `${KIND_LABEL[p.kind]} for ${targetWords(p.facts)}: approved and applied.`;
            run(p.id, () => approveProposal(p.id, note), done).then((ok) => ok && afterApproved(p, done));
          }}
          onDecline={(note) => run(p.id, () => declineProposal(p.id, note), `${KIND_LABEL[p.kind]} for ${targetWords(p.facts)}: ${me && p.proposed_by === me ? 'withdrawn' : 'declined'}.`)}
        />
      ))}
      {showDecided ? decided.map((p) => <ProposalCard key={p.id} proposal={p} who={who} me={me} busy={false} onApprove={() => undefined} onDecline={() => undefined} />) : null}
    </section>
  );
}
