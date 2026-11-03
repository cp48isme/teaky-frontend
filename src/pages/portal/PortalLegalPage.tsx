import { useParams } from 'react-router-dom';
import { legalUpdatedLabel, portalLegalPage, type LegalKind } from '../../lib/portalLegal';

interface Props {
  kind: LegalKind;
}

/** /p/{slug}/privacy and /p/{slug}/terms — the notice and terms published under the printer's name. */
export default function PortalLegalPage({ kind }: Props) {
  const { slug = '' } = useParams<{ slug: string }>();
  const page = portalLegalPage(slug, kind);
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-heading text-2xl font-bold text-gray-900">{page.title}</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated {legalUpdatedLabel(page.updated)}</p>
      {page.sections.map((section, i) => (
        <section key={section.heading ?? i} className="mt-6">
          {section.paragraphs.map((paragraph, j) => (
            <p key={j} className="mt-4 text-base leading-7 text-gray-700 first:mt-0">
              {j === 0 && section.heading && (
                <strong className="font-semibold text-gray-900">{section.heading} </strong>
              )}
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
