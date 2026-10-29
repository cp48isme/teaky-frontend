import type { ReactNode } from 'react';

/** The sign-in card shell (same washes, card and rule as LoginPage) for the
 *  forgot/reset pages. No logo link: a person here is not shopping for Teaky. */
export default function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-light">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-teak/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 h-[300px] w-[300px] rounded-full bg-teak-light/6 blur-[120px]" />
      </div>
      <div className="relative w-full max-w-md px-6">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-black/5">
          <div className="h-1 bg-gradient-to-r from-teak-dark via-teak to-teak-light" />
          <div className="p-8">
            <h2 className="font-heading text-2xl font-bold text-brand-dark">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-wood">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
