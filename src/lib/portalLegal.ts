/**
 * Portal legal pages: /p/{slug}/privacy and /p/{slug}/terms.
 *
 * Routed per portal from the start; the content is one shared default — the
 * privacy notice and terms of use published under Single Source RGI's name
 * (operator dispatch 30 Oct 2026, text verbatim). The second printer gets its
 * own text through BY_SLUG without re-plumbing.
 */

export type LegalKind = 'privacy' | 'terms';

export interface LegalSection {
  /** The bold lead ("What we collect.") that opens the section; null for an unheaded paragraph. */
  heading: string | null;
  paragraphs: string[];
}

export interface LegalPage {
  title: string;
  sections: LegalSection[];
  /** ISO date (YYYY-MM-DD) of the text now published. Never a placeholder: the page test refuses one. */
  updated: string;
}

/**
 * The date the text below shipped. Set when the text changes, not on every
 * build, so the line means what it says.
 */
export const LEGAL_UPDATED = '2026-10-30';

const PRIVACY: LegalPage = {
  title: 'Privacy notice',
  updated: LEGAL_UPDATED,
  sections: [
    {
      heading: null,
      paragraphs: [
        'This portal is provided to you by Single Source RGI, who your property already orders from, so that your property can order printed materials. Single Source RGI is a trading name of Single Source RGI, LLC, and nothing about who you are dealing with has changed. Single Source RGI runs the portal on software made by Teaky (Mango Grove, LLC d/b/a Teaky Grove), which hosts it and holds the information described below on Single Source RGI’s behalf and on its instructions.',
      ],
    },
    {
      heading: 'What we collect.',
      paragraphs: [
        'Your name and work email address, so you can sign in. The password you choose, stored only as an irreversible hash. The IP address your account was created from. The delivery address, attention line and telephone number you give us for each order. Your purchase-order number and any notes or artwork instructions you write. Where a product is personalised — business cards, name-line cards — the name and job title you supply for the person it is for.',
      ],
    },
    {
      heading: 'Why we collect it.',
      paragraphs: [
        'To take your order, to produce it, to deliver it to the right place, and to invoice your property. Nothing is used for advertising, sold, or shared with anyone for their own purposes.',
      ],
    },
    {
      heading: 'Who sees it.',
      paragraphs: [
        'Single Source RGI’s staff. Single Source, US — a different company, despite the similar name — who print and ship your order and therefore receive the delivery details and anything written on the job. Teaky, who host the portal. Postmark, who deliver the emails we send you. Those are the only parties who receive your order information.',
      ],
    },
    {
      heading: 'How long we keep it.',
      paragraphs: [
        'Order records for six years, because your property and ours both need them for accounting and tax. Your account for as long as your property uses the portal; when it stops, we close the account, and the order records attached to it are kept for the six years above. The IP address your account was created from is kept with the account as part of its security record, and is used only to look into a problem with the account itself.',
      ],
    },
    {
      heading: 'Your choices.',
      paragraphs: [
        'You can ask what we hold about you, ask us to correct it, or ask us to delete your account. Depending on where you work you may have a legal right to all three. Write to Single Source RGI, LLC, 13915 W. 107th Street, Lenexa, KS 66215, and we will come back to you within 45 days. We will still have to keep order records we need for tax and accounting.',
      ],
    },
    {
      heading: 'Cookies.',
      paragraphs: [
        'This portal sets no cookies at all, not even to keep you signed in. When you sign in, your browser stores a token on your own device. The portal loads its typefaces from Google Fonts, so Google receives your IP address when a page loads; nothing else about you is shared with them.',
      ],
    },
    {
      heading: 'Questions.',
      paragraphs: [
        'For anything about an order, contact Jeni Sharp at Single Source RGI — jenis@singlesourceus.com, or 913-469-6800 ext. 2009. Single Source RGI, LLC, 13915 W. 107th Street, Lenexa, KS 66215.',
      ],
    },
  ],
};

const TERMS: LegalPage = {
  title: 'Terms of use',
  updated: LEGAL_UPDATED,
  sections: [
    {
      heading: 'Who this is between.',
      paragraphs: [
        'Your property and Single Source RGI, a trading name of Single Source RGI, LLC. Single Source RGI provides the portal using software from Teaky (Mango Grove, LLC d/b/a Teaky Grove). Your agreement for the printing itself is with Single Source RGI, on whatever terms already apply between you.',
      ],
    },
    {
      heading: 'Your account.',
      paragraphs: [
        'Your sign-in is yours. Do not share it — orders placed from your account are treated as placed by you, and front-desk computers are shared more often than passwords should be. Tell Single Source RGI straight away if you think someone else has your sign-in.',
      ],
    },
    {
      heading: 'Placing an order.',
      paragraphs: [
        'Prices shown are the prices Single Source RGI has agreed with your property. An order placed in the portal is an instruction to produce and deliver; Single Source RGI will confirm it. Orders are invoiced to your property on 30-day terms. Nothing is charged in the portal.',
      ],
    },
    {
      heading: 'Artwork, and what your declaration means.',
      paragraphs: [
        'When you order something that has been printed for you before, the portal asks whether the artwork should be reused exactly as it was last approved, or whether changes are needed.',
        'This choice has consequences. If you say the artwork is unchanged, it goes to press without a new proof and nobody reviews it again before it is printed. If you ask for changes, a proof is sent to you and to Single Source RGI, and nothing is printed until it is approved. Please choose carefully — a reprint of the wrong version is still a reprint, and it will have been produced as instructed.',
      ],
    },
    {
      heading: 'Content you supply.',
      paragraphs: [
        'Names, titles, logos, images and text you give us for a job: you confirm your property has the right to use them and to have them printed. This matters most on personalised items — business cards and name-line cards — where you are supplying another person’s name.',
      ],
    },
    {
      heading: 'Changing or cancelling.',
      paragraphs: [
        'Once a job is in production it may not be possible to change or cancel it, and work already done may still be chargeable. Contact Single Source RGI as soon as you can.',
      ],
    },
    {
      heading: 'Availability.',
      paragraphs: [
        'The portal is provided as it stands. Single Source RGI and Teaky do not guarantee it will be available at all times, and neither is liable for losses arising from it being unavailable — you can always reach Single Source RGI the way you always have.',
      ],
    },
    {
      heading: 'Limitation of liability.',
      paragraphs: [
        'This section is about the portal itself. Your agreement with Single Source RGI for the printing — including anything in it about faulty or late work — is unchanged.',
        'If the portal is at fault — it sends an order twice, it fails to send one at all, or it carries your instructions through wrongly — tell Single Source RGI. A job produced in error through the portal’s fault is not charged to your property, and an order that did not reach production is produced as soon as it can be. That is the remedy, and for the portal it is the limit of what Single Source RGI and Teaky owe you. It does not cover a reprint of the wrong version where the artwork was declared unchanged, which is covered above.',
        'Neither Single Source RGI nor Teaky is liable for indirect or consequential loss arising from the portal — lost profit, lost business, lost bookings or lost goodwill. Their liability between them for any one order is limited to the price of that order.',
        'You are not liable to Single Source RGI or Teaky for indirect or consequential loss either. That does not change what your property owes for what it has ordered, or the confirmation you give above about content you supply.',
        'Nothing in these terms limits liability for death or personal injury caused by negligence, for fraud, or for anything that cannot lawfully be limited.',
      ],
    },
    {
      heading: 'Governing law.',
      paragraphs: ['Kansas, and the courts of Johnson County, Kansas.'],
    },
  ],
};

const DEFAULT: Record<LegalKind, LegalPage> = { privacy: PRIVACY, terms: TERMS };

/** Per-portal overrides, keyed by slug. Empty until a second printer has its own text. */
const BY_SLUG: Record<string, Partial<Record<LegalKind, LegalPage>>> = {};

export function portalLegalPage(slug: string, kind: LegalKind): LegalPage {
  return BY_SLUG[slug]?.[kind] ?? DEFAULT[kind];
}

export function portalLegalPath(slug: string, kind: LegalKind): string {
  return `/p/${slug}/${kind}`;
}

/** "30 October 2026" from the ISO date, for the "Last updated" line. */
export function legalUpdatedLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
