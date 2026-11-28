import { useEffect, useState } from 'react';
import { getProductionSettings, getTagRules, updateProductionSettings, updateTagRules } from '../../api/production';
import ProductionLayout from '../../components/production/ProductionLayout';
import ActionResult from '../../components/production/ActionResult';
import { isShadowReader } from '../../lib/roles';
import { NO_FLOOR_ROLE, isNoFloorRole, loadFailureText } from '../../lib/productionAccess';
import type { CustomerTagRule, ProductionSettings } from '../../types/production';
import type { ProductionView } from '../../lib/productionView';

/** Production settings (t08, 19 Nov 2026): the shop's list-view default (a26)
 * and, beside it, the customer → tags rules the intake applies (#264) —
 * each rule a customer, a channel ('' = every channel) and its tags; written
 * whole, audited on the server. Staff only; a shadow reader has no page. */

const CHANNELS = ['', 'taylor', 'inspire', 'pagedna'] as const;
const field: React.CSSProperties = { fontSize: 14, padding: '6px 8px', border: '1px solid var(--sg-line-3)', borderRadius: 6, background: 'var(--sg-surface)' };
const button: React.CSSProperties = { ...field, cursor: 'pointer' };
const card: React.CSSProperties = { background: 'var(--sg-surface)', border: '1px solid var(--sg-line)', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 };

export function rulesForWire(rules: CustomerTagRule[]): CustomerTagRule[] {
  return rules.map((r) => ({ customer_match: r.customer_match.trim(), channel: r.channel, tags: r.tags.map((t) => t.trim()).filter(Boolean) }));
}

export function parseTags(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.split(',')) {
    const t = raw.trim();
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

export default function ProductionSettingsPage({ readOnly = isShadowReader() }: { readOnly?: boolean } = {}) {
  const [settings, setSettings] = useState<ProductionSettings | null>(null);
  const [rules, setRules] = useState<CustomerTagRule[]>([]);
  const [tagText, setTagText] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [noRole, setNoRole] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (readOnly) return;
    Promise.all([getProductionSettings(), getTagRules()])
      .then(([s, r]) => {
        setSettings(s);
        setRules(r.customer_tags);
        setTagText(r.customer_tags.map((x) => x.tags.join(', ')));
      })
      .catch((e: unknown) => (isNoFloorRole(e) ? setNoRole(true) : setError(loadFailureText(e, 'Could not load the settings'))));
  }, [readOnly]);

  async function setView(view: ProductionView) {
    if (!settings) return;
    setBusy(true);
    setNotice(null);
    try {
      setSettings(await updateProductionSettings({ ...settings, production_view: view }));
      setNotice(view === 'list' ? 'Batches opens as a list for the shop; each browser can still choose.' : 'Batches opens as cards for the shop; each browser can still choose.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The setting was refused');
    } finally {
      setBusy(false);
    }
  }

  async function setBridge(on: boolean) {
    if (!settings) return;
    setBusy(true);
    setNotice(null);
    setError(null);
    try {
      setSettings(await updateProductionSettings({ ...settings, bridge_bundles_enabled: on }));
      setNotice(on ? 'On: the bridge on the shop\'s PC will write each batch\'s files to the job-tickets folder. This change is recorded.' : 'Off: the bridge is offered no batch files and writes nothing. This change is recorded.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The setting was refused');
    } finally {
      setBusy(false);
    }
  }

  function setRule(i: number, patch: Partial<CustomerTagRule>) {
    setRules((all) => all.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  async function saveRules() {
    setBusy(true);
    setNotice(null);
    setError(null);
    const wire = rulesForWire(rules.map((r, i) => ({ ...r, tags: parseTags(tagText[i] ?? '') })));
    const bad = wire.find((r) => !r.customer_match || r.tags.length === 0);
    if (bad) {
      setError('Every rule needs a customer and at least one tag.');
      setBusy(false);
      return;
    }
    try {
      const saved = await updateTagRules({ customer_tags: wire });
      setRules(saved.customer_tags);
      setTagText(saved.customer_tags.map((x) => x.tags.join(', ')));
      setNotice(saved.customer_tags.length ? `${saved.customer_tags.length} rule${saved.customer_tags.length === 1 ? '' : 's'} saved; new orders of those customers get the tags.` : 'No rules; new orders get no tags from a rule.');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The rules were refused');
    } finally {
      setBusy(false);
    }
  }

  const view: ProductionView = settings?.production_view ?? 'cards';
  const bridge = settings?.bridge_bundles_enabled ?? false;
  return (
    <ProductionLayout readOnly={readOnly}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Production settings</h1>
      {error ? <ActionResult kind="refused">{error}</ActionResult> : null}
      {notice ? <ActionResult kind="done">{notice}</ActionResult> : null}
      {noRole || readOnly ? (
        <div role="status" style={{ color: 'var(--sg-muted)' }} data-testid="no-floor-role">
          {NO_FLOOR_ROLE}
        </div>
      ) : (
        <>
          <section style={card} aria-labelledby="view-default" data-testid="view-default">
            <h2 id="view-default" style={{ margin: 0, fontSize: 16 }}>Batches opens as</h2>
            <div role="group" aria-label="List view default" style={{ display: 'flex', gap: 2 }}>
              {(['cards', 'list'] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} disabled={busy || !settings} onClick={() => setView(v)} style={{ ...button, background: view === v ? 'var(--sg-brand-stem)' : 'var(--sg-surface)', color: view === v ? 'var(--sg-surface)' : 'var(--sg-ink)' }}>
                  {v === 'cards' ? 'Cards' : 'List'}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>The shop's default; a browser's own toggle on Batches overrides it there.</div>
          </section>
          <section style={card} aria-labelledby="bridge-bundles" data-testid="bridge-bundles">
            <h2 id="bridge-bundles" style={{ margin: 0, fontSize: 16 }}>Bridge writes batch files to the job-tickets folder</h2>
            <div role="group" aria-label="Bridge writes batch files" style={{ display: 'flex', gap: 2 }}>
              {([false, true] as const).map((on) => (
                <button key={String(on)} type="button" aria-pressed={bridge === on} disabled={busy || !settings} onClick={() => setBridge(on)} style={{ ...button, background: bridge === on ? 'var(--sg-brand-stem)' : 'var(--sg-surface)', color: bridge === on ? 'var(--sg-surface)' : 'var(--sg-ink)' }}>
                  {on ? 'On' : 'Off'}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>Off (the default): the bridge on the shop's PC is offered no batch files and writes nothing; it only keeps the Taylor session. Switching it on is a deliberate step taken together with the shop, and every change is recorded with who made it.</div>
          </section>
          <section style={card} aria-labelledby="tag-rules" data-testid="tag-rules">
            <h2 id="tag-rules" style={{ margin: 0, fontSize: 16 }}>Tags by customer</h2>
            <div style={{ fontSize: 13, color: 'var(--sg-muted)' }}>Every new order of the customer gets these tags, on the channel named or on every channel. A tag set by hand stays; a rule only adds.</div>
            {rules.length === 0 ? <div style={{ color: 'var(--sg-muted)' }}>No rules yet.</div> : null}
            {rules.map((r, i) => (
              <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }} data-testid="tag-rule">
                <input aria-label="Customer" placeholder="Customer, as the channel names it" style={{ ...field, flex: '1 1 200px' }} value={r.customer_match} disabled={busy} onChange={(e) => setRule(i, { customer_match: e.target.value })} />
                <select aria-label="Channel" style={field} value={r.channel} disabled={busy} onChange={(e) => setRule(i, { channel: e.target.value })}>
                  {CHANNELS.map((c) => (
                    <option key={c} value={c}>
                      {c === '' ? 'Every channel' : c}
                    </option>
                  ))}
                </select>
                <input aria-label="Tags" placeholder="Tags, comma-separated" style={{ ...field, flex: '1 1 160px' }} value={tagText[i] ?? ''} disabled={busy} onChange={(e) => setTagText((all) => all.map((t, j) => (j === i ? e.target.value : t)))} />
                <button type="button" aria-label={`Remove rule ${i + 1}`} style={button} disabled={busy} onClick={() => { setRules((all) => all.filter((_, j) => j !== i)); setTagText((all) => all.filter((_, j) => j !== i)); }}>
                  Remove
                </button>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" style={button} disabled={busy} onClick={() => { setRules((all) => [...all, { customer_match: '', channel: '', tags: [] }]); setTagText((all) => [...all, '']); }}>
                Add rule
              </button>
              <button type="button" style={{ ...button, background: 'var(--sg-brand-stem)', color: 'var(--sg-surface)' }} disabled={busy || settings === null} onClick={saveRules}>
                Save rules
              </button>
            </div>
          </section>
        </>
      )}
    </ProductionLayout>
  );
}
