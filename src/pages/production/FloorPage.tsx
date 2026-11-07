import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../../api/client';
import { getStationView, holdFromStation, listStationScans, scanArrived, scanDone } from '../../api/production';
import ProductionLayout, { colors } from '../../components/production/ProductionLayout';
import { ageText } from '../../lib/production';
import type { RouteStep, StationScan, StationView } from '../../types/production';

/** Board 3: the station view — one station per device, chosen once and
 * remembered in this browser; a scan field that takes keyboard-wedge input
 * (the scanner types the unit id and Enter); Arrived / Done call day 3's
 * endpoints; a scan out of order shows the refusal as the server words it;
 * "hold this batch" with a note; the station's last scans. */

const STATION_KEY = 'teaky.floor.station';
const PERSON_KEY = 'teaky.floor.person';
const STATIONS = ['Prepress', 'Press 1', 'Press 2', 'Cutter', 'Folder', 'Bench 1', 'Shipping'];

function remembered(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

function remember(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* a private window: the choice lasts the page */
  }
}

const dark: React.CSSProperties = { background: '#1c1917', color: '#f5f0ea', borderRadius: 10, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 };
const mono: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
const btn: React.CSSProperties = { padding: '14px 18px', borderRadius: 8, border: '1px solid #3f3a35', background: '#2a2522', color: '#f5f0ea', fontWeight: 600, minHeight: 56, minWidth: 200, font: 'inherit', fontSize: 17, cursor: 'pointer' };
const go: React.CSSProperties = { ...btn, background: colors.vein, borderColor: colors.vein };
const quiet: React.CSSProperties = { ...btn, minWidth: 0, minHeight: 44, fontSize: 14, fontWeight: 500, padding: '8px 12px' };

function stepPill(step: RouteStep): React.CSSProperties {
  const base: React.CSSProperties = { display: 'inline-block', padding: '4px 10px', borderRadius: 999, fontSize: 13, fontWeight: 500 };
  if (step.state === 'done') return { ...base, background: '#2e4a1f', color: '#cfe9b8' };
  if (step.state === 'at') return { ...base, background: '#7a4a10', color: '#ffe3b3' };
  if (step.state === 'skipped') return { ...base, background: '#3a3530', color: '#bdb5ab' };
  return { ...base, background: '#2a2522', color: '#bdb5ab' };
}

export default function FloorPage() {
  const [station, setStation] = useState<string>(() => remembered(STATION_KEY));
  const [person, setPerson] = useState<string>(() => remembered(PERSON_KEY));
  const [choosing, setChoosing] = useState<boolean>(() => !remembered(STATION_KEY) || !remembered(PERSON_KEY));
  const [scan, setScan] = useState('');
  const [card, setCard] = useState<StationView | null>(null);
  const [scans, setScans] = useState<StationScan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [holdNote, setHoldNote] = useState('');
  const [holding, setHolding] = useState(false);
  const scanRef = useRef<HTMLInputElement>(null);

  const refreshScans = useCallback(async () => {
    try {
      setScans(await listStationScans(station));
    } catch {
      setScans([]);
    }
  }, [station]);

  useEffect(() => {
    if (!choosing) refreshScans().catch(() => undefined);
  }, [choosing, refreshScans]);

  useEffect(() => {
    if (!choosing) scanRef.current?.focus();
  }, [choosing, card]);

  async function lookUp(text: string) {
    const id = text.trim();
    if (!id) return;
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      setCard(await getStationView(id));
      setScan('');
    } catch (e: unknown) {
      setCard(null);
      setError(e instanceof ApiError && e.status === 404 ? `No batch answers to "${id}" in this shop.` : e instanceof Error ? e.message : 'The scan was refused');
    } finally {
      setBusy(false);
    }
  }

  async function press(kind: 'arrived' | 'done') {
    if (!card?.expected) return;
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      const result = kind === 'arrived' ? await scanArrived(card.unit_id, card.expected.position, person, station) : await scanDone(card.unit_id, card.expected.position, person, station);
      setNotice(kind === 'arrived' ? `Batch ${result.batch_number} arrived at ${result.step.name} — ${result.scanned_by}, ${station}.` : `Batch ${result.batch_number} done with ${result.step.name}${result.next_expected ? ` — next ${result.next_expected.name}` : ' — the route is finished'}.`);
      setCard(await getStationView(card.unit_id));
      await refreshScans();
    } catch (e: unknown) {
      // The server's own words: which scan it expected, and where.
      setError(e instanceof Error ? e.message : 'The scan was refused');
      try {
        setCard(await getStationView(card.unit_id));
      } catch {
        /* keep the card as it was */
      }
      await refreshScans();
    } finally {
      setBusy(false);
    }
  }

  async function hold() {
    if (!card?.expected || holdNote.trim().length < 3) return;
    setBusy(true);
    setError(null);
    try {
      const result = await holdFromStation(card.unit_id, card.expected.position, person, station, holdNote.trim());
      setNotice(`Batch ${result.batch_number} held at ${result.step?.name ?? 'this step'} — it shows on Held with your name and the step.`);
      setHolding(false);
      setHoldNote('');
      setCard(await getStationView(card.unit_id));
      await refreshScans();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'The hold was refused');
    } finally {
      setBusy(false);
    }
  }

  function chooseStation(e: React.FormEvent) {
    e.preventDefault();
    if (!station || !person.trim()) return;
    remember(STATION_KEY, station);
    remember(PERSON_KEY, person.trim());
    setChoosing(false);
  }

  const expectedLabel = card?.expected ? (card.expected_scan === 'arrived' ? `Arrived at ${card.expected.name}` : `Done — ${card.steps.find((s) => s.position === card.expected!.position + 1)?.name ? `to ${card.steps.find((s) => s.position === card.expected!.position + 1)!.name}` : 'route finished'}`) : null;

  return (
    <ProductionLayout footnote="The job ticket's barcode is the unit id. The floor touches only Teaky; Docket keeps the record.">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>Floor</h1>
        <span style={{ color: '#4b5563', fontSize: 14 }}>Station view · {station || 'no station yet'} · scanner or phone</span>
        {!choosing ? (
          <button type="button" onClick={() => setChoosing(true)} style={{ ...quiet, background: '#fff', color: '#1c1917', borderColor: '#c9cfd6', marginLeft: 'auto' }}>
            Station: {station} · you: {person} — change
          </button>
        ) : null}
      </div>

      {choosing ? (
        <form onSubmit={chooseStation} data-testid="choose-station" style={{ background: '#fff', border: '1px solid #e1e5ea', borderRadius: 8, padding: 20, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'end' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
            This device is the station
            <select aria-label="Station" value={station} onChange={(e) => setStation(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #c9cfd6', borderRadius: 6, font: 'inherit', minHeight: 44, minWidth: 200 }}>
              <option value="">Choose…</option>
              {STATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
            Your name or initials (on every scan)
            <input aria-label="Your name" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="D." style={{ padding: '10px 12px', border: '1px solid #c9cfd6', borderRadius: 6, font: 'inherit', minHeight: 44, width: 160 }} />
          </label>
          <button type="submit" disabled={!station || !person.trim()} style={{ ...go, minWidth: 0, minHeight: 44, fontSize: 15 }}>
            Remember on this device
          </button>
          <span style={{ fontSize: 13, color: '#4b5563', flexBasis: '100%' }}>Chosen once; the browser remembers it. Nothing else to type at the station.</span>
        </form>
      ) : null}

      {!choosing ? (
        <section style={dark} aria-label={`Station view · ${station}`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <span style={{ ...mono, fontSize: 22, letterSpacing: 2 }}>▮▮▌▮▌▮▮▌</span>
            <input
              ref={scanRef}
              aria-label="Scan the batch ticket"
              value={scan}
              onChange={(e) => setScan(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  lookUp(scan).catch(() => undefined);
                }
              }}
              placeholder="Scan the batch ticket's barcode when it arrives and when it leaves. Nothing to type."
              autoComplete="off"
              style={{ ...mono, flex: '1 1 320px', padding: '12px 14px', borderRadius: 8, border: '1px solid #3f3a35', background: '#0f0d0c', color: '#f5f0ea', fontSize: 16, minHeight: 48 }}
            />
            <button type="button" onClick={() => lookUp(scan)} disabled={busy || !scan.trim()} style={{ ...quiet }}>
              Look up
            </button>
          </div>
          {error ? (
            <div role="alert" data-testid="floor-refusal" style={{ background: '#5a1f14', color: '#ffd9d1', padding: '12px 14px', borderRadius: 8, fontSize: 15 }}>
              {error}
            </div>
          ) : null}
          {notice ? (
            <div role="status" style={{ color: '#cfe9b8', fontSize: 15 }}>
              {notice}
            </div>
          ) : null}
          {card ? (
            <div data-testid="station-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'baseline' }}>
                <span style={{ ...mono, fontSize: 40, fontWeight: 700 }}>{card.batch_number}</span>
                <span style={{ fontSize: 15, color: '#d9d2c8' }}>
                  {card.stock ?? 'stock —'} · {card.steps.length} steps · {card.docket_number ? `Docket ${card.docket_number}` : 'no Docket number yet'}
                  {card.held ? ' · HELD' : ''}
                </span>
              </div>
              <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {card.steps.map((s) => (
                  <li key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={stepPill(s)}>
                      {s.position} · {s.name}
                      {s.state === 'at' ? ' — here' : s.state === 'done' ? ' ✓' : s.state === 'skipped' ? ' (skipped)' : ''}
                    </span>
                    {s.position < card.steps.length ? <span style={{ color: '#7a7268' }}>→</span> : null}
                  </li>
                ))}
              </ol>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                {card.expected && expectedLabel ? (
                  <>
                    <button type="button" data-testid="scan-arrived" disabled={busy || card.expected_scan !== 'arrived'} onClick={() => press('arrived')} style={card.expected_scan === 'arrived' ? go : btn}>
                      Arrived at {card.expected.name}
                    </button>
                    <button type="button" data-testid="scan-done" disabled={busy || card.expected_scan !== 'done'} onClick={() => press('done')} style={card.expected_scan === 'done' ? go : btn}>
                      {card.expected_scan === 'done' ? expectedLabel : `Done with ${card.expected.name}`}
                    </button>
                  </>
                ) : (
                  <span style={{ color: '#cfe9b8' }}>The route is finished — nothing is expected.</span>
                )}
                {card.expected ? (
                  <button type="button" onClick={() => setHolding((h) => !h)} disabled={busy} style={{ ...quiet, marginLeft: 'auto' }}>
                    A problem? Hold this batch
                  </button>
                ) : null}
              </div>
              {holding && card.expected ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                  <input aria-label="Why" value={holdNote} onChange={(e) => setHoldNote(e.target.value)} placeholder="What is wrong (shows on Held with your name and the step)" style={{ flex: '1 1 320px', padding: '10px 12px', borderRadius: 8, border: '1px solid #3f3a35', background: '#0f0d0c', color: '#f5f0ea', font: 'inherit', minHeight: 44 }} />
                  <button type="button" onClick={hold} disabled={busy || holdNote.trim().length < 3} style={quiet}>
                    Hold batch {card.batch_number}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div style={{ color: '#bdb5ab', fontSize: 15 }}>Scan a ticket to see the batch's route and the next expected scan.</div>
          )}
          <div style={{ borderTop: '1px solid #3f3a35', paddingTop: 12, fontSize: 14, color: '#d9d2c8' }}>
            <span style={{ color: '#bdb5ab' }}>Last scans{station ? ` at ${station}` : ''}:</span>{' '}
            {scans.length ? (
              scans.slice(0, 6).map((s, i) => (
                <span key={`${s.at}-${i}`} style={{ marginRight: 14 }}>
                  <span style={mono}>{s.batch_number ?? '?'}</span> {s.scan === 'refused' ? 'refused' : s.scan === 'hold' ? 'held' : s.scan}
                  {s.step ? ` · ${s.step}` : ''} · {ageText(Math.max(0, Math.round((Date.now() - new Date(s.at).getTime()) / 1000)))} ago · {s.scanned_by}
                </span>
              ))
            ) : (
              <span>none yet</span>
            )}
          </div>
        </section>
      ) : null}
    </ProductionLayout>
  );
}
