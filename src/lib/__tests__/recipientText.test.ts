import { describe, it, expect } from 'vitest';
import { recipientText, looksLikeEmail } from '../recipientText';

// 2026-10-26: a recipient carries name, title, email and phone; rows written
// before then hold name and title only and must still render unchanged.

describe('recipientText', () => {
  it('renders the new shape as "Name (Title), email, phone"', () => {
    expect(
      recipientText({ name: 'Jeni Sharp', title: 'Director of Sales', email: 'jenis@singlesourceus.com', phone: '(816) 555-0100' }),
    ).toBe('Jeni Sharp (Director of Sales), jenis@singlesourceus.com, (816) 555-0100');
  });

  it('renders an old-shape row exactly as before', () => {
    expect(recipientText({ name: 'Alex Rivera', title: null })).toBe('Alex Rivera');
    expect(recipientText({ name: 'Alex Rivera', title: 'Concierge' })).toBe('Alex Rivera (Concierge)');
  });
});

describe('looksLikeEmail', () => {
  it('accepts an ordinary address and rejects the obvious non-addresses', () => {
    expect(looksLikeEmail('jenis@singlesourceus.com')).toBe(true);
    expect(looksLikeEmail(' front.desk@raphaelkc.com ')).toBe(true);
    expect(looksLikeEmail('jenis')).toBe(false);
    expect(looksLikeEmail('jenis@')).toBe(false);
    expect(looksLikeEmail('')).toBe(false);
  });
});
