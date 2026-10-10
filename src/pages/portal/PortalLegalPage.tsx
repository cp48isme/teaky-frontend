import { useParams } from 'react-router-dom';
import { portalLegalPage, type LegalKind } from '../../lib/portalLegal';

interface Props {
  kind: LegalKind;
}

/** /p/{slug}/privacy and /p/{slug}/terms — placeholder content until the real
 * pages are finished and signed off (bead printer-agent2-71le). */
export default function PortalLegalPage({ kind }: Props) {
  const { slug = '' } = useParams<{ slug: string }>();
  const page = portalLegalPage(slug, kind);
  const [lead, ...rest] = page.paragraphs;
  const last = rest.length > 0 ? rest[rest.length - 1] : null;
  const middle = rest.slice(0, -1);
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading text-2xl font-bold text-gray-900">{page.title}</h1>
      <p className="mt-6 text-base leading-7 text-gray-700">{lead}</p>
      {middle.map((p) => (
        <p key={p} className="mt-4 text-base leading-7 text-gray-700">
          {p}
        </p>
      ))}
      {last && (
        <p className="mt-4 text-base leading-7 text-gray-700">
          {last} {page.contact}.
        </p>
      )}
      <p className="mt-8 text-sm text-gray-500">Last updated {page.updated}.</p>
    </div>
  );
}
