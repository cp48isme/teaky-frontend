import { describe, it, expect } from 'vitest';
import { recipientText, looksLikeEmail, looksLikePhone } from '../recipientText';

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

describe('looksLikePhone (30 Oct 2026, ruling R4)', () => {
  it.each([
    '816-555-0101',
    '(816) 555-0101',
    '816.555.0101',
    '8165550101',
    '+1 816 555 0101',
    '+44 20 7946 0958',
    '+44 (0)20 7946 0958',
    '913-469-6800 ext. 2009',
    '913-469-6800 x2009',
    '555-0101',
    '  816-555-0101  ',
  ])('accepts a real number in any format: %s', (value) => {
    expect(looksLikePhone(value)).toBe(true);
  });

  it.each(['x', '', '   ', '12', '555-01', 'call me', '816-555-0101 please', 'pat@example.com', '1'.repeat(21)])(
    'refuses letters and too few digits: %j',
    (value) => {
      expect(looksLikePhone(value)).toBe(false);
    },
  );
});
