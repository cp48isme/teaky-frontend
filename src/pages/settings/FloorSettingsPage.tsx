import { ProductionSettingsPanel } from '../production/ProductionSettingsPage';

/** Settings → Floor (navigation 1c, dispatch 28 Nov 2026 afternoon; ruling
 * 26 Nov point 3 — "Settings is one page with one Admin tab"): the production
 * settings (Batches opens as, the bridge switch, tags by customer) live in
 * the one Settings hub; the floor nav's Settings item is gone. The API gate
 * is unchanged (production:rules); a sign-in without it sees the panel's
 * own "no floor role" note. */
export default function FloorSettingsPage() {
  return (
    <div className="production-root" data-testid="floor-settings">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <ProductionSettingsPanel readOnly={false} />
      </div>
    </div>
  );
}
