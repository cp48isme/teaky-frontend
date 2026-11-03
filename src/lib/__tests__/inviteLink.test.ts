import { afterEach, describe, expect, it } from 'vitest';
import {
  forgetInviteToken,
  inviteFragmentPath,
  readInviteFragment,
  rememberInviteToken,
  resolveInviteToken,
} from '../inviteLink';

// nt7z: the token lives in the fragment; the path form is honoured for links already
// sent; a parked token covers the sign-in round trip; nothing goes in ?next=.
describe('inviteLink', () => {
  afterEach(() => forgetInviteToken());

  it('reads the fragment form', () => {
    expect(readInviteFragment('#token=abc_-123')).toBe('abc_-123');
    expect(readInviteFragment('')).toBe('');
    expect(resolveInviteToken('#token=frag', 'path')).toBe('frag');
  });

  it('falls back to the path form, then to the parked token', () => {
    expect(resolveInviteToken('', 'path-tok')).toBe('path-tok');
    rememberInviteToken('parked');
    expect(resolveInviteToken('', undefined)).toBe('parked');
    forgetInviteToken();
    expect(resolveInviteToken('', undefined)).toBe('');
  });

  it('writes the fragment form with the token encoded', () => {
    expect(inviteFragmentPath('a b')).toBe('/invite#token=a+b');
    expect(inviteFragmentPath('tok-123')).toBe('/invite#token=tok-123');
  });
});
