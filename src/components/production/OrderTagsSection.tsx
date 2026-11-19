import { useEffect, useState } from 'react';
import { listShopTags } from '../../api/orders';
import TagEditor from './TagEditor';

/** The order page's tags (t08, 19 Nov 2026): the editor over the order's
 * tags, saved on every change through the page's PATCH; the shop's list
 * loaded once for the picker. */
export default function OrderTagsSection({
  tags,
  onSave,
}: {
  tags: readonly string[];
  /** PATCH the whole list; resolves to the saved list, or undefined when refused (the page reports why). */
  onSave: (next: string[]) => Promise<readonly string[] | undefined>;
}) {
  const [options, setOptions] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    listShopTags()
      .then((l) => setOptions(l.tags))
      .catch(() => setOptions([]));
  }, []);
  async function change(next: string[]) {
    setBusy(true);
    try {
      const saved = await onSave(next);
      if (saved) setOptions((o) => Array.from(new Set([...o, ...saved])));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div data-testid="order-tags">
      <label className="block text-xs font-medium text-gray-500">Tags</label>
      <div className="mt-1">
        <TagEditor tags={tags} options={options} readOnly={false} busy={busy} onChange={change} />
      </div>
    </div>
  );
}
