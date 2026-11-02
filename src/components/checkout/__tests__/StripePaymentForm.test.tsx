import { render } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import StripePaymentForm from '../StripePaymentForm';

// 30 Oct 2026: Stripe.js used to be injected on app boot — the default entry of
// @stripe/stripe-js injects its script on import, and loadStripe ran at module
// scope. Both are gone; these tests pin that Stripe.js is fetched by the payment
// form, on mount, and by nothing earlier.

const stripeScripts = () =>
  Array.from(document.querySelectorAll('script')).filter((s) =>
    (s.getAttribute('src') ?? '').includes('stripe.com'),
  );

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

afterEach(() => {
  stripeScripts().forEach((s) => s.remove());
});

describe('StripePaymentForm', () => {
  it('importing the module injects no Stripe.js script', async () => {
    await settle();
    expect(stripeScripts()).toHaveLength(0);
  });

  it('importing the checkout page injects no Stripe.js script', async () => {
    await import('../../../pages/portal/CheckoutPage');
    await settle();
    expect(stripeScripts()).toHaveLength(0);
  });

  it('mounting the payment form injects Stripe.js once, and once only', async () => {
    const { unmount } = render(
      <StripePaymentForm clientSecret="pi_test_secret_test" onSuccess={() => {}} />,
    );
    await settle();
    expect(stripeScripts()).toHaveLength(1);
    expect(stripeScripts()[0]!.getAttribute('src')).toMatch(/^https:\/\/js\.stripe\.com\//);
    unmount();
    render(<StripePaymentForm clientSecret="pi_test_secret_test" onSuccess={() => {}} />);
    await settle();
    expect(stripeScripts()).toHaveLength(1);
  });
});
