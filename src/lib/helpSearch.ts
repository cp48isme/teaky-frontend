import { headingId, parseMarkdown, plainText, type Block } from './markdown';

/** The manual's search (navigation 1d, dispatch 28 Nov 2026 afternoon): a
 * case-insensitive substring match over each page's sections — a section is
 * a heading and the text under it — answered as page › section links with
 * the heading's anchor. Client-side, over the same markdown files the pages
 * render; no backend. */

export interface HelpSource {
  slug: string;
  title: string;
  source: string;
}

export interface HelpHit {
  slug: string;
  pageTitle: string;
  heading: string;
  id: string;
  snippet: string;
}

interface Section {
  heading: string;
  id: string;
  text: string;
}

function blockText(block: Block): string {
  switch (block.kind) {
    case 'heading':
    case 'paragraph':
      return plainText(block.inlines);
    case 'list':
      return block.items.map(plainText).join(' ');
    case 'table':
      return [...block.header, ...block.rows.flat()].map(plainText).join(' ');
  }
}

export function sectionsOf(source: string, pageTitle: string): Section[] {
  const out: Section[] = [];
  let current: Section = { heading: pageTitle, id: '', text: '' };
  for (const block of parseMarkdown(source).blocks) {
    if (block.kind === 'heading' && block.level <= 2) {
      if (current.text.trim() || current.id) out.push(current);
      const heading = plainText(block.inlines);
      current = { heading, id: block.id || headingId(heading), text: '' };
    } else {
      current.text += ' ' + blockText(block);
    }
  }
  if (current.text.trim() || current.id) out.push(current);
  return out;
}

function snippetAround(text: string, needle: string): string {
  const at = text.toLowerCase().indexOf(needle);
  if (at < 0) return text.trim().slice(0, 90);
  const start = Math.max(0, at - 40);
  const end = Math.min(text.length, at + needle.length + 60);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

export function searchHelp(query: string, pages: HelpSource[]): HelpHit[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits: HelpHit[] = [];
  for (const page of pages) {
    for (const section of sectionsOf(page.source, page.title)) {
      const haystack = `${section.heading} ${section.text}`;
      if (haystack.toLowerCase().includes(needle)) {
        hits.push({ slug: page.slug, pageTitle: page.title, heading: section.heading, id: section.id, snippet: snippetAround(section.text, needle) || section.heading });
      }
    }
  }
  return hits;
}
