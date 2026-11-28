import type { ReactNode } from 'react';
import { parseMarkdown, type Inline } from '../lib/markdown';

function renderInlines(inlines: Inline[]): ReactNode[] {
  return inlines.map((inline, i) => {
    switch (inline.kind) {
      case 'bold':
        return <strong key={i}>{inline.text}</strong>;
      case 'italic':
        return <em key={i}>{inline.text}</em>;
      case 'code':
        // Selectable text, never a link: a contact address lives here on purpose.
        return <code key={i} className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[0.95em] select-all">{inline.text}</code>;
      case 'link':
        return <a key={i} href={inline.href} className="font-medium text-teak-dark underline-offset-2 hover:underline">{inline.text}</a>;
      default:
        return <span key={i}>{inline.text}</span>;
    }
  });
}

/** Renders a content file (t02): a visible Draft label while the file says so. */
export default function Markdown({ source }: { source: string }) {
  const doc = parseMarkdown(source);
  return (
    <div className="space-y-4 text-brand-dark">
      {doc.draft && (
        <p className="inline-block rounded bg-amber-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800" data-testid="draft-label">
          Draft — not yet final
        </p>
      )}
      {doc.blocks.map((block, i) => {
        if (block.kind === 'heading') {
          const Tag = (`h${block.level}` as 'h1' | 'h2' | 'h3');
          const size = block.level === 1 ? 'text-2xl' : block.level === 2 ? 'text-xl' : 'text-lg';
          return <Tag key={i} id={block.id} className={`font-heading ${size} font-bold scroll-mt-4`}>{renderInlines(block.inlines)}</Tag>;
        }
        if (block.kind === 'table') {
          return (
            <div key={i} className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    {block.header.map((cell, j) => <th key={j} className="border-b border-gray-300 px-3 py-2 text-left font-semibold align-bottom">{renderInlines(cell)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, r) => (
                    <tr key={r} className="align-top">
                      {row.map((cell, j) => <td key={j} className="border-b border-gray-100 px-3 py-2">{renderInlines(cell)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.kind === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul';
          return (
            <ListTag key={i} className={`${block.ordered ? 'list-decimal' : 'list-disc'} space-y-1 pl-6`}>
              {block.items.map((item, j) => <li key={j}>{renderInlines(item)}</li>)}
            </ListTag>
          );
        }
        return <p key={i} className="leading-relaxed">{renderInlines(block.inlines)}</p>;
      })}
    </div>
  );
}
