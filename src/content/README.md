# Site content (t02, 18 Nov 2026)

`privacy.md`, `terms.md` and `contact.md` are rendered at `/privacy`, `/terms` and `/contact` by `ContentPage` through the small renderer in `src/lib/markdown.ts` (headings, paragraphs, lists, links, bold, italic, inline code; no raw HTML). Edit the file, commit, and the next image build ships it — no code change. A file whose first line is `<!-- draft -->` shows a visible **Draft** label; remove that line when the text is final. In `contact.md`, an address written as inline code (`` `name@host` ``) is rendered as selectable text, never as a mailto link.
