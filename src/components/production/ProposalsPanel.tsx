import { useCallback, useEffect, useMemo, useState } from 'react';
import { approveProposal, declineProposal, listProposals, proposeAction } from '../../api/proposals';
import { listMembers } from '../../api/team';
import { colors } from './ProductionLayout';
import { ageText, ageSeconds } from '../../lib/production';
import { currentUserId } from '../../lib/roles';
import { NO_FLOOR_ROLE, isNoFloorRole, loadFailureText } from '../../lib/productionAccess';
import { KIND_LABEL, factsText } from '../../lib/proposalsCopy';
import type { ActionProposal, ActionProposalKind, ActionProposalTarget, PushAloneReason } from '../../types/proposals';

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
  proposed: { background: '#fbf1d9', color: '#7a5a12', text: 'proposed — waiting for a decision' },
  approved: { background: '#e6f3ee', color: '#558b2f', text: 'approved and applied' },
  declined: { background: '#e9ebef', color: '#3f4854', text: 'declined' },
  withdrawn: { background: '#e9ebef', color: '#3f4854', text: 'withdrawn by the proposer' },
  failed: { background: '#fdebe6', color: '#a3331d', text: 'approved, but the action refused' },
};

const card: React.CSSProperties = { background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 };
const lbl: React.CSSProperties = { fontSize: 12, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '.02em' };
const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid #c9cfd6', background: '#fff', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const primary: React.CSSProperties = { ...btn, background: colors.vein, color: '#fff', borderColor: colors.vein };
const danger: React.CSSProperties = { ...btn, borderColor: '#a3331d', color: '#a3331d' };
const field: React.CSSProperties = { padding: '9px 10px', border: '1px solid #c9cfd6', borderRadius: 6, font: 'inherit', minHeight: 44, background: '#fff' };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13 };
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
}: {
  proposal: ActionProposal;
  who: (id: string | null) => string;
  me: string | null;
  busy: boolean;
  onApprove: (note: string) => void;
  onDecline: (note: string) => void;
  readOnly?: boolean;
}) {
  const [note, setNote] = useState('');
  const [confirmDone, setConfirmDone] = useState(false);
  const open = proposal.status === 'proposed';
  const mine = Boolean(me && proposal.proposed_by === me);
  const status = STATUS_PILL[proposal.status];
  return (
    <div style={card} data-testid={`proposal-${proposal.kind}`} data-status={proposal.status}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600 }}>{KIND_LABEL[proposal.kind]}</span>
        <span style={mono}>{proposal.facts.reference}</span>
        <span style={{ marginLeft: 'auto', ...pill, background: status.background, color: status.color }}>{status.text}</span>
      </div>
      <div style={{ fontSize: 14 }}>
        <span style={{ color: '#4b5563' }}>Proposed by</span> <span data-testid="proposed-by">{who(proposal.proposed_by)}</span>{' '}
        <span style={{ color: '#4b5563' }}>· {ageText(ageSeconds(proposal.proposed_at))} ago</span>
        {proposal.category ? <span style={{ color: '#4b5563' }}> · {proposal.category}</span> : null}
      </div>
      <div style={{ fontSize: 14 }}>
        <span style={lbl}>Reason</span>
        <div data-testid="proposal-reason">{proposal.reason}</div>
        {proposal.note ? <div style={{ color: '#4b5563' }}>{proposal.note}</div> : null}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px 16px' }} data-testid="proposal-facts">
        {factsText(proposal).map((f) => (
          <Fact key={f.label} label={f.label} value={f.value} />
        ))}
        <Fact label="Facts as of" value={new Date(proposal.facts.captured_at).toLocaleString('en-US')} />
      </div>
      {!open ? (
        <div style={{ fontSize: 13, color: '#4b5563' }}>
          {proposal.status === 'withdrawn' ? 'Withdrawn' : 'Decided'} by {who(proposal.decided_by)}
          {proposal.decided_at ? ` · ${new Date(proposal.decided_at).toLocaleString('en-US')}` : ''}
          {proposal.decision_note ? ` · ${proposal.decision_note}` : ''}
          {proposal.failure ? <div style={{ color: '#a3331d' }}>The action refused: {proposal.failure}</div> : null}
        </div>
      ) : readOnly ? (
        <div style={{ fontSize: 13, color: '#4b5563' }} data-testid="waiting-for-a-decision">
          Waiting for a decision by a staff member.
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <input aria-label="Decision note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="a note on the decision (optional)" style={{ ...field, flex: '1 1 220px' }} />
          {proposal.kind === 'mark_done' && !confirmDone ? (
            <button type="button" disabled={busy} onClick={() => setConfirmDone(true)} style={primary} data-testid="approve-first">
              Approve…
            </button>
          ) : (
            <button type="button" disabled={busy} onClick={() => onApprove(note)} style={primary} data-testid="approve">
              {proposal.kind === 'mark_done' ? 'Yes, mark it done — skip the remaining steps' : proposal.kind === 'push_short_run' ? 'Approve (then confirm the push-out)' : 'Approve and apply'}
            </button>
          )}
          <button type="button" disabled={busy} onClick={() => onDecline(note)} style={danger} data-testid="decline">
            {mine ? 'Withdraw' : 'Decline'}
          </button>
          {proposal.kind === 'mark_done' && confirmDone ? (
            <div style={{ flexBasis: '100%', fontSize: 13, color: '#a3331d' }} data-testid="approve-confirm-note">
              Approving marks {proposal.facts.reference} done: every remaining route step is skipped by a person, with this reason kept. Nothing is printed by it.
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function ProposeForm({ targets, busy, onPropose }: { targets: ProposalTarget[]; busy: boolean; onPropose: (body: { kind: ActionProposalKind; target: ProposalTarget; reason: string; category?: PushAloneReason; note: string }) => void }) {
  const [targetKey, setTargetKey] = useState(targets[0] ? `${targets[0].target_kind}:${targets[0].target_id}` : '');
  const target = targets.find((t) => `${t.target_kind}:${t.target_id}` === targetKey) ?? targets[0] ?? null;
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
  if (!targets.length) return <div style={{ color: '#4b5563', fontSize: 14 }}>Nothing on this screen to propose an action for.</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} data-testid="propose-form">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
          For
          <select aria-label="Proposal target" value={targetKey} onChange={(e) => { setTargetKey(e.target.value); setConfirmDone(false); }} style={field}>
            {targets.map((t) => (
              <option key={`${t.target_kind}:${t.target_id}`} value={`${t.target_kind}:${t.target_id}`}>
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
          <span style={{ fontSize: 13, color: '#a3331d' }} data-testid="propose-confirm-note">
            Mark done skips every remaining route step for {target?.label}. Nothing is applied until a person approves the proposal.
          </span>
        ) : (
          <span style={{ fontSize: 13, color: '#4b5563' }}>Nothing happens on propose. A person approves it; a short run still goes through the push-out confirmation.</span>
        )}
      </div>
    </div>
  );
}

export default function ProposalsPanel({ targets, readOnly = false }: { targets: ProposalTarget[]; readOnly?: boolean }) {
  const [proposals, setProposals] = useState<ActionProposal[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [noRole, setNoRole] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [showDecided, setShowDecided] = useState(false);
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
    (id: string | null) => (id ? names[id] ?? (readOnly ? 'a staff member' : id.slice(0, 8)) : 'the system'),
    [names, readOnly],
  );

  async function run(key: string, fn: () => Promise<unknown>, done: string) {
    setBusy(key);
    setNotice(null);
    setError(null);
    try {
      await fn();
      setNotice(done);
      await load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Refused');
    } finally {
      setBusy(null);
    }
  }

  const open = proposals.filter((p) => p.status === 'proposed');
  const decided = proposals.filter((p) => p.status !== 'proposed');
  return (
    <section aria-labelledby="proposals" style={{ display: 'flex', flexDirection: 'column', gap: 16 }} data-testid="proposals-panel">
      <div>
        <h2 id="proposals" style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Proposals</h2>
        <div style={{ color: '#4b5563', fontSize: 14 }}>
          {open.length} waiting for a decision · {decided.length} decided. An action is proposed with a reason and the facts present, and applied only when a person approves it.
        </div>
      </div>
      {error ? <div role="alert" style={{ color: '#a3331d' }}>{error}</div> : null}
      {noRole ? <div role="status" style={{ color: '#4b5563' }} data-testid="no-floor-role">{NO_FLOOR_ROLE}</div> : null}
      {notice ? <div role="status" style={{ color: colors.vein }}>{notice}</div> : null}
      {readOnly ? (
        <div style={{ fontSize: 13, color: '#4b5563' }} data-testid="proposals-read-only-note">
          Read-only: proposals are shown as staff see them; proposing and deciding are staff actions.
        </div>
      ) : (
      <div style={card}>
        <div style={{ fontWeight: 500 }}>Propose an action</div>
        <ProposeForm
          targets={targets}
          busy={busy !== null}
          onPropose={({ kind, target, reason, category, note }) =>
            run(
              'propose',
              () => proposeAction({ kind, target_kind: target.target_kind, target_id: target.target_id, reason, category, note }),
              `${KIND_LABEL[kind]} proposed for ${target.label}; nothing is applied until a person approves it.`,
            )
          }
        />
      </div>
      )}
      {open.map((p) => (
        <ProposalCard
          key={p.id}
          proposal={p}
          who={who}
          me={me}
          readOnly={readOnly}
          busy={busy === p.id}
          onApprove={(note) => run(p.id, () => approveProposal(p.id, note), `${KIND_LABEL[p.kind]} for ${p.facts.reference}: approved and applied.`)}
          onDecline={(note) => run(p.id, () => declineProposal(p.id, note), `${KIND_LABEL[p.kind]} for ${p.facts.reference}: ${me && p.proposed_by === me ? 'withdrawn' : 'declined'}.`)}
        />
      ))}
      {decided.length ? (
        <button type="button" onClick={() => setShowDecided((s) => !s)} style={{ ...btn, alignSelf: 'flex-start' }} data-testid="toggle-decided">
          {showDecided ? 'Hide decided' : `Show ${decided.length} decided`}
        </button>
      ) : null}
      {showDecided ? decided.map((p) => <ProposalCard key={p.id} proposal={p} who={who} me={me} busy={false} onApprove={() => undefined} onDecline={() => undefined} />) : null}
    </section>
  );
}
