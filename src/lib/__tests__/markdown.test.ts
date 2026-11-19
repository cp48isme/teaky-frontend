import { describe, expect, it } from 'vitest';
import { parseInline, parseMarkdown } from '../markdown';

/** The content renderer (t02): headings, paragraphs, lists, links, bold,
 * italic, inline code; the draft marker; no HTML passes through. */
describe('markdown', () => {
  it('reads the draft marker, headings, paragraphs and lists', () => {
    const doc = parseMarkdown('<!-- draft -->\n# Privacy\n\nOne line\nand its continuation.\n\n- a\n- b\n\n1. first\n2) second\n');
    expect(doc.draft).toBe(true);
    expect(doc.blocks.map((b) => b.kind)).toEqual(['heading', 'paragraph', 'list', 'list']);
    expect(doc.blocks[1]).toEqual({ kind: 'paragraph', inlines: [{ kind: 'text', text: 'One line and its continuation.' }] });
    expect(doc.blocks[2]).toMatchObject({ ordered: false, items: [[{ kind: 'text', text: 'a' }], [{ kind: 'text', text: 'b' }]] });
    expect(doc.blocks[3]).toMatchObject({ ordered: true });
  });

  it('keeps an address as code (selectable text), a link as a link, and never raw HTML', () => {
    expect(parseInline('Write to `hello@example.com` or see [the site](https://example.com) **now**')).toEqual([
      { kind: 'text', text: 'Write to ' },
      { kind: 'code', text: 'hello@example.com' },
      { kind: 'text', text: ' or see ' },
      { kind: 'link', text: 'the site', href: 'https://example.com' },
      { kind: 'text', text: ' ' },
      { kind: 'bold', text: 'now' },
    ]);
    const doc = parseMarkdown('<script>alert(1)</script> and <b>bold</b>');
    expect(doc.draft).toBe(false);
    expect(doc.blocks).toEqual([{ kind: 'paragraph', inlines: [{ kind: 'text', text: '<script>alert(1)</script> and <b>bold</b>' }] }]);
    expect(parseInline('[x](javascript:alert(1))')).toEqual([{ kind: 'text', text: '[x](javascript:alert(1))' }]);
  });
});
