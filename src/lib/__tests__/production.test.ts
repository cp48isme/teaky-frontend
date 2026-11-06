import { describe, expect, it } from 'vitest';
import { ageText, nextSort, slotStrip, slotsFor, sortRows } from '../production';

describe('All Channel Orders sort', () => {
  const rows = [
    { order: 'W2', received: '2026-11-05T08:40:00Z', age: 43, product: 'b' },
    { order: 'W1', received: '2026-11-05T09:12:00Z', age: 11, product: 'A' },
    { order: 'W3', received: '2026-11-04T16:20:00Z', age: 1020, product: null as string | null },
  ];
  it('sorts Received descending by default and flips on a second press', () => {
    const first = nextSort({ key: 'product', direction: 'asc' }, 'received', ['received']);
    expect(first).toEqual({ key: 'received', direction: 'desc' });
    expect(sortRows(rows, first.key, first.direction).map((r) => r.order)).toEqual(['W1', 'W2', 'W3']);
    const second = nextSort(first, 'received', ['received']);
    expect(second.direction).toBe('asc');
    expect(sortRows(rows, 'received', 'asc').map((r) => r.order)).toEqual(['W3', 'W2', 'W1']);
  });
  it('sorts numbers by value and puts nulls last', () => {
    expect(sortRows(rows, 'age', 'asc').map((r) => r.age)).toEqual([11, 43, 1020]);
    expect(sortRows(rows, 'product', 'asc').map((r) => r.order)).toEqual(['W1', 'W2', 'W3']);
  });
});

describe('the batch strip of 24 slots', () => {
  it('shows filled, then fillable, then blank, and never more than the capacity', () => {
    const strip = slotStrip(21, 2, 24);
    expect(strip).toHaveLength(24);
    expect(strip.filter((s) => s === 'filled')).toHaveLength(21);
    expect(strip.filter((s) => s === 'fill')).toHaveLength(2);
    expect(strip.filter((s) => s === 'blank')).toHaveLength(1);
    expect(strip.slice(0, 21).every((s) => s === 'filled')).toBe(true);
    expect(strip[21]).toBe('fill');
    expect(strip[23]).toBe('blank');
  });
  it('caps the fillable at the blanks and a full batch has no blanks', () => {
    expect(slotStrip(24, 5, 24).every((s) => s === 'filled')).toBe(true);
    expect(slotStrip(22, 9, 24).filter((s) => s === 'fill')).toHaveLength(2);
    expect(slotStrip(0, 0, 12)).toHaveLength(12);
  });
});

describe('words', () => {
  it('ages read as the board reads them', () => {
    expect(ageText(11 * 60)).toBe('11 min');
    expect(ageText(3600)).toBe('1 h');
    expect(ageText(2 * 86400)).toBe('2 d');
  });
  it('slots are qty × pack ÷ 250, never less than one', () => {
    expect(slotsFor(250)).toBe(1);
    expect(slotsFor(500)).toBe(2);
    expect(slotsFor(10)).toBe(1);
    expect(slotsFor(9000)).toBe(36);
  });
});
