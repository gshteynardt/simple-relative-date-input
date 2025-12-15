/**
 * Парсер относительных дат с поддержкой таймзон
 *
 * Примеры:
 *   now       - текущее время
 *   now-5m    - 5 минут назад
 *   now+1d    - завтра
 *   now/d     - начало дня
 *   now-1d/d  - начало вчерашнего дня
 *   now-1M/M  - начало прошлого месяца
 *   now+1d/d  - начало завтрашнего дня
 *   now+1M/M  - начало следующего месяца
 */

import { DateTime } from './date-utils/dateTime';
import type { TimeUnit } from './date-utils/dateTime';

export type TimeZoneUtc = 'utc';

export type TimeZoneBrowser = 'browser';

export type TimeZone = TimeZoneBrowser | TimeZoneUtc | string;

export interface TimeZoneOptions {
    timeZone?: TimeZone;
}

const validUnits = new Set<string>(['s', 'm', 'h', 'd', 'w', 'M', 'Q', 'y']);

/**
 * Checks if the string is a relative date (starts with "now")
 */
export const isRelativeDate = (text: string): boolean => {
    return text.trim().toLowerCase().startsWith('now');
};

/**
 * Validates the relative date
 */
export const isValidRelativeDate = (text: string): boolean => {
    return parseRelativeDate(text) !== null;
};

export interface ParseOptions {
    timeZone?: TimeZone;
}

export function parseRelativeDate(text: string, options: ParseOptions = {}): DateTime | null {
    const EOT = '';
    let pos = 0;
    let ch: string = '';

    const nextChar = () => {
        if (pos < text.length) {
            ch = text[pos];
            pos++;
        } else {
            ch = EOT;
        }
    };

    class ParseError extends Error {
        pos: number;

        constructor(message: string, pos: number) {
            super(message);
            this.pos = pos;
        }
    }

    // Spaces =  {' ' | '\t'}
    const skipSpaces = () => {
        while (ch === ' ' || ch === '\t') {
            nextChar();
        }
    };

    const now = (): DateTime => {
        if (ch === 'n' || ch === 'N') {
            nextChar();
        } else {
            throw new ParseError('"n" expected', pos);
        }

        if ((ch as string) === 'o' || (ch as string) === 'O') {
            nextChar();
        } else {
            throw new ParseError('"o" expected', pos);
        }

        if ((ch as string) === 'w' || (ch as string) === 'W') {
            nextChar();
        } else {
            throw new ParseError('"w" expected', pos);
        }

        const { timeZone } = options;
        return DateTime.now({ timeZone });
    };

    // OptionalInt = ['0'...'9'{'0'...'9'}]
    const optionalInt = (): number => {
        if ('0' <= ch && ch <= '9') {
            const startPos = pos;
            let num = Number(ch);
            nextChar();

            while ('0' <= ch && ch <= '9') {
                num = num * 10 + Number(ch);

                if (num > 1e9) {
                    throw new ParseError('too big int', startPos);
                }

                nextChar();
            }

            return num;
        } else {
            return 1;
        }
    };

    // Unit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'Q' | 'y'
    const readUnit = (): TimeUnit => {
        const unit = ch as TimeUnit;

        if (validUnits.has(unit)) {
            nextChar();

            return unit;
        } else {
            throw new ParseError(`unexpected time unit, allowed: ${Array.from(validUnits).join(', ')}`, pos);
        }
    };

    // RelativeDate = Spaces 'now' Spaces {('-' | '+' | '/') Spaces OptionalInt Spaces Unit Spaces}
    const relativeDate = (): DateTime => {
        skipSpaces();
        let time = now();
        skipSpaces();

        while (ch === '-' || ch === '+' || ch === '/') {
            const op = ch;

            nextChar();
            skipSpaces();

            const numPos = pos;
            const num = optionalInt();
            skipSpaces();

            const unit = readUnit();
            skipSpaces();

            if (op === '/') {
                if (num !== 1) {
                    throw new ParseError('number should be 1 or missing for operation "/"', numPos);
                }

                time = time.startOf(unit);
            } else if (op === '+') {
                time = time.add(num, unit);
            } else if (op === '-') {
                time = time.subtract(num, unit);
            } else {
                throw new ParseError(`internal error - unexpected operation ${op}`, pos);
            }
        }

        return time;
    };

    try {
        nextChar();
        const ans = relativeDate();

        if (ch !== EOT) {
            throw new ParseError(`unexpected char ${ch}`, pos);
        }

        return ans;
    } catch (e) {
        if (e instanceof ParseError) {
            console.error({ m: e.message, pos: e.pos - 1 });
            return null;
        } else {
            throw e;
        }
    }
}
