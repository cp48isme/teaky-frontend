import { Link } from 'react-router-dom';

const PAGES: Record<string, { title: string; description: string }> = {
  about: {
    title: 'About Teaky',
    description:
      'Teaky gives commercial printers a branded ordering portal for each of their customers: the customer picks a product and a quantity, and the order arrives at the printer ready to produce.',
  },
  privacy: {
    title: 'Privacy Policy',
    description:
      'Your privacy matters to us. This page will contain our full privacy policy detailing how we collect, use, and protect your data.',
  },
  terms: {
    title: 'Terms of Service',
    description:
      'This page will contain our terms of service governing the use of the Teaky platform.',
  },
  security: {
    title: 'Security',
    description:
      'Teaky takes security seriously. This page will detail our security practices, certifications, and how we protect your data.',
  },
  contact: {
    title: 'Contact Us',
    description:
      'Have questions or need help? Reach out to our team at support@teaky.com.',
  },
};

export default function PlaceholderPage({ page }: { page: string }) {
  const info = PAGES[page] ?? { title: 'Page', description: 'Coming soon.' };

  return (
    <div className="min-h-screen bg-brand-light">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/teaky-logo.svg" alt="Teaky" className="h-9 w-9" />
            <span className="font-heading text-xl font-bold tracking-tight text-brand-dark">
              teaky
            </span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-bark transition hover:text-teak-dark"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to home
        </Link>
        <h1 className="font-heading text-3xl font-bold text-brand-dark">{info.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-bark">{info.description}</p>
      </div>
    </div>
  );
}
