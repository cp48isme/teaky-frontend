import { describe, expect, it } from 'vitest';
import { detailText } from '../client';

describe('detailText', () => {
  it('uses a string detail as is', () => {
    expect(detailText({ detail: 'Up to 4 packs per order here.' })).toBe('Up to 4 packs per order here.');
  });

  it('renders a 422 validation list as "field: message"', () => {
    expect(
      detailText({
        detail: [
          { loc: ['body', 'recipients', 0, 'phone'], msg: 'Value error, needs at least 7 digits', type: 'value_error' },
          { loc: ['body', 'shipping_address', 'city'], msg: 'Field required', type: 'missing' },
        ],
      }),
    ).toBe('phone: needs at least 7 digits city: Field required');
  });

  it('is null for a body with nothing usable', () => {
    expect(detailText({})).toBeNull();
    expect(detailText({ detail: [] })).toBeNull();
    expect(detailText({ detail: { code: 1 } })).toBeNull();
    expect(detailText(null)).toBeNull();
  });
});
