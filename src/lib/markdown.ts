/** A small markdown reader for the site's content pages (t02, 18 Nov 2026):
 * headings, paragraphs, bullet and numbered lists, links, bold, italic and
 * inline code. No raw HTML passes through, so a content file can never carry
 * markup or script. Enough for a privacy notice, terms and a contact page. */

export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'italic'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'link'; text: string; href: string };

export type Block =
  | { kind: 'heading'; level: 1 | 2 | 3; inlines: Inline[]; id: string }
  | { kind: 'paragraph'; inlines: Inline[] }
  | { kind: 'list'; ordered: boolean; items: Inline[][] }
  | { kind: 'table'; header: Inline[][]; rows: Inline[][][] };

/** The id a heading gets, so a search result or a link can land on it
 * (navigation 1d, 28 Nov 2026): lower-case words joined by hyphens. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** The plain words of a run of inlines (for ids and for search). */
export function plainText(inlines: Inline[]): string {
  return inlines.map((i) => i.text).join('');
}

function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
}

const TABLE_ROW = /^\s*\|.*\|\s*$/;
const TABLE_RULE = /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?\s*$/;

export interface Document {
  draft: boolean;
  blocks: Block[];
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|\/)[^)\s]+\))/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last) out.push({ kind: 'text', text: text.slice(last, index) });
    const token = match[0];
    if (token.startsWith('**')) out.push({ kind: 'bold', text: token.slice(2, -2) });
    else if (token.startsWith('`')) out.push({ kind: 'code', text: token.slice(1, -1) });
    else if (token.startsWith('*')) out.push({ kind: 'italic', text: token.slice(1, -1) });
    else {
      const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (m) out.push({ kind: 'link', text: m[1]!, href: m[2]! });
    }
    last = index + token.length;
  }
  if (last < text.length) out.push({ kind: 'text', text: text.slice(last) });
  return out;
}

export function parseMarkdown(source: string): Document {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const draft = /^\s*<!--\s*draft\s*-->\s*$/i.test(lines[0] ?? '');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: Inline[][] } | null = null;
  let table: { header: Inline[][]; rows: Inline[][][] } | null = null;
  const flushTable = () => {
    if (table) blocks.push({ kind: 'table', header: table.header, rows: table.rows });
    table = null;
  };
  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ kind: 'paragraph', inlines: parseInline(paragraph.join(' ')) });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push({ kind: 'list', ordered: list.ordered, items: list.items });
    list = null;
  };
  const source_lines = lines.slice(draft ? 1 : 0);
  for (let n = 0; n < source_lines.length; n++) {
    const raw = source_lines[n]!;
    const line = raw.trimEnd();
    if (/^\s*<!--.*-->\s*$/.test(line)) continue; // a comment line is never shown
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    const bullet = /^\s*[-*]\s+(.+)$/.exec(line);
    const numbered = /^\s*\d+[.)]\s+(.+)$/.exec(line);
    // A table (navigation 1d): a header row, a rule row, then body rows; it ends at the first line that is not a row.
    if (TABLE_ROW.test(line) && (table || TABLE_RULE.test(source_lines[n + 1] ?? ''))) {
      flushParagraph();
      flushList();
      if (!table) {
        table = { header: splitRow(line).map(parseInline), rows: [] };
        n += 1; // the rule row
      } else {
        table.rows.push(splitRow(line).map(parseInline));
      }
      continue;
    }
    flushTable();
    if (!line.trim()) {
      flushParagraph();
      flushList();
    } else if (heading) {
      flushParagraph();
      flushList();
      const inlines = parseInline(heading[2]!);
      blocks.push({ kind: 'heading', level: heading[1]!.length as 1 | 2 | 3, inlines, id: headingId(plainText(inlines)) });
    } else if (bullet || numbered) {
      flushParagraph();
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push(parseInline((bullet ?? numbered)![1]!));
    } else {
      flushList();
      paragraph.push(line.trim());
    }
  }
  flushParagraph();
  flushList();
  flushTable();
  return { draft, blocks };
}
