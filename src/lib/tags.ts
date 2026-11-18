/** Order tags on the orders page (Andrew, 17 Nov 2026; ruling 18 Nov 2026):
 * every tag an order carries is a chip; a chip cycles off → include → exclude
 * → off. Include keeps rows whose order carries any included tag; exclude
 * drops rows whose order carries any excluded tag (exclude wins). Rows with no
 * order — a raw Taylor line not yet written — carry no tags, so an include
 * hides them and an exclude keeps them. The same two parameters go to the
 * backend as `tag` / `exclude_tag`. */

export type TagMode = 'include' | 'exclude';

export interface TagFilter {
  include: string[];
  exclude: string[];
}

export const EMPTY_TAG_FILTER: TagFilter = { include: [], exclude: [] };

export function tagUniverse(tagLists: Iterable<readonly string[] | null | undefined>): string[] {
  const seen = new Set<string>();
  for (const tags of tagLists) for (const tag of tags ?? []) seen.add(tag);
  return [...seen].sort((a, b) => a.localeCompare(b));
}

export function tagMode(filter: TagFilter, tag: string): TagMode | null {
  if (filter.exclude.includes(tag)) return 'exclude';
  if (filter.include.includes(tag)) return 'include';
  return null;
}

/** off → include → exclude → off. */
export function cycleTag(filter: TagFilter, tag: string): TagFilter {
  const mode = tagMode(filter, tag);
  const include = filter.include.filter((t) => t !== tag);
  const exclude = filter.exclude.filter((t) => t !== tag);
  if (mode === null) return { include: [...include, tag], exclude };
  if (mode === 'include') return { include, exclude: [...exclude, tag] };
  return { include, exclude };
}

export function passesTagFilter(filter: TagFilter, tags: readonly string[] | null | undefined): boolean {
  const own = tags ?? [];
  if (filter.exclude.some((t) => own.includes(t))) return false;
  if (filter.include.length > 0 && !filter.include.some((t) => own.includes(t))) return false;
  return true;
}

export function tagFilterText(filter: TagFilter): string {
  const parts: string[] = [];
  if (filter.include.length) parts.push(`only ${filter.include.join(', ')}`);
  if (filter.exclude.length) parts.push(`without ${filter.exclude.join(', ')}`);
  return parts.join(' · ');
}
