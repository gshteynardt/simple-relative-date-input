import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { dateTime } from './date-utils/dateTime/dateTime.ts';
import { parseRelativeDate } from './parseRelativeDate.ts';

const DEFAULT_DATE = '2025-12-01T12:00:00Z';
const options = { timeZone: 'utc' as const };

// TODO: add tests for different time zones and DST changes
// TODO: add tests for differnt units for operator "/" and "+" and "-"

describe('parseRelativeDate', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(DEFAULT_DATE));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('basic parsing', () => {
        it('parses "now" and returns current time', () => {
            const result = parseRelativeDate({ text: 'now', dateTime, options });

            expect(result.error).toBeUndefined();
            expect(result.ans?.toISOString()).toBe('2025-12-01T12:00:00.000Z');
        });

        it('parses "NOW" (case-insensitive)', () => {
            const result = parseRelativeDate({ text: 'NOW', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-12-01T12:00:00.000Z');
        });
    });

    describe('operation subtraction', () => {
        it('parses "now-2h" and returns current time minus 2 hours', () => {
            const result = parseRelativeDate({ text: 'now-2h', dateTime, options });

            expect(result.error).toBeUndefined();
            expect(result.ans?.toISOString()).toBe('2025-12-01T10:00:00.000Z');
        });

        it('parses "now-30m" and returns current time minus 30 minutes', () => {
            const result = parseRelativeDate({ text: 'now-30m', dateTime, options });

            expect(result.error).toBeUndefined();
            expect(result.ans?.toISOString()).toBe('2025-12-01T11:30:00.000Z');
        });

        it('parses "now-1d" and returns current time minus 1 day', () => {
            const result = parseRelativeDate({ text: 'now-1d', dateTime, options });

            expect(result.error).toBeUndefined();
            expect(result.ans?.toISOString()).toBe('2025-11-30T12:00:00.000Z');
        });

        it('parses "now-1w" and returns current time minus 1 week', () => {
            const result = parseRelativeDate({ text: 'now-1w', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-11-24T12:00:00.000Z');
        });

        it('parses "now-1M" and returns current time minus 1 month', () => {
            const result = parseRelativeDate({ text: 'now-1M', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-11-01T12:00:00.000Z');
        });

        it('parses "now-1y" and returns current time minus 1 year', () => {
            const result = parseRelativeDate({ text: 'now-1y', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2024-12-01T12:00:00.000Z');
        });
    });

    describe('operation addition', () => {
        it('parses "now+3h" and returns current time plus 3 hours', () => {
            const result = parseRelativeDate({ text: 'now+3h', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-12-01T15:00:00.000Z');
        });

        it('parses "now+1d" and returns current time plus 1 day', () => {
            const result = parseRelativeDate({ text: 'now+1d', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-12-02T12:00:00.000Z');
        });
    });

    describe('rounding operation', () => {
        it('parses "now/d" and returns start of day', () => {
            const result = parseRelativeDate({ text: 'now/d', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-12-01T00:00:00.000Z');
        });

        it('parses "now/h" and returns start of hour', () => {
            const result = parseRelativeDate({ text: 'now/h', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-12-01T12:00:00.000Z');
        });

        it('parses "now/M" and returns start of month', () => {
            const result = parseRelativeDate({ text: 'now/M', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-12-01T00:00:00.000Z');
        });

        it('parses "now/y" and returns start of year', () => {
            const result = parseRelativeDate({ text: 'now/y', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-01-01T00:00:00.000Z');
        });
    });

    describe('combination of operations', () => {
        it('parses "now/d-1d" and returns yesterday at 00:00', () => {
            const result = parseRelativeDate({ text: 'now/d-1d', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-11-30T00:00:00.000Z');
        });

        it('parses "now-1d/d" and returns yesterday at 00:00 (other order)', () => {
            const result = parseRelativeDate({ text: 'now-1d/d', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-11-30T00:00:00.000Z');
        });

        it('parses "now/d+8h" and returns today at 08:00', () => {
            const result = parseRelativeDate({ text: 'now/d+8h', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-12-01T08:00:00.000Z');
        });

        it('parses "now-1d-2h-30m" and returns complex expression', () => {
            const result = parseRelativeDate({ text: 'now-1d-2h-30m', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-11-30T09:30:00.000Z');
        });

        it('parses "now/M-1M" and returns start of last month', () => {
            const result = parseRelativeDate({ text: 'now/M-1M', dateTime, options });

            expect(result.ans?.toISOString()).toBe('2025-11-01T00:00:00.000Z');
        });
    });

    describe('errors', () => {
      it('returns error and null for empty string', () => {
        const result = parseRelativeDate({ text: '', dateTime, options });
        
        expect(result.error).toBeDefined();
        expect(result.errorPos).toBeDefined();
        expect(result.ans).toBeNull();
      });
  
      it('returns error for unknown unit "now-1x"', () => {
        const result = parseRelativeDate({ text: 'now-1x', dateTime, options });
        
        expect(result.error).toContain('unexpected time unit');
        expect(result.ans).toBeNull();
      });
  
      it('returns error for "now/2d" (number != 1)', () => {
        const result = parseRelativeDate({ text: 'now/2d', dateTime, options });
        
        expect(result.error).toBe('number should be 1 or missing for operation "/"');
        expect(result.ans).toBeNull();
      });
  
      it('returns error for too big number', () => {
        const result = parseRelativeDate({ text: 'now-9999999999d', dateTime, options });
        
        expect(result.error).toBe('too big int');
        expect(result.ans).toBeNull();
      });
    });
});
