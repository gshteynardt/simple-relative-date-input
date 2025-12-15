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
    return parseRelativeDate(text.trim()) !== undefined;
};

export interface ParseOptions {
    roundUp?: boolean;
    timeZone?: TimeZone;
}

export function parseRelativeDate(text: string, options: ParseOptions = {}): DateTime | undefined {
    if (!text) {
        return undefined;
    }

    const { roundUp, timeZone } = options;

    let time: DateTime | undefined;
    let mathString = '';

    if (text.substring(0, 3) === 'now') {
        time = DateTime.now({ timeZone });
        mathString = text.substring('now'.length);
    }

    if (!time || !time.isValid()) {
        return undefined;
    }

    if (!mathString.length) {
        return time;
    }

    return parseDateMath(mathString, time, roundUp);
}

export function parseDateMath(mathString: string, time: DateTime, roundUp?: boolean): DateTime | undefined {
    const strippedMathString = mathString.replace(/\s/g, '');
    let resultTime = time;
    let i = 0;
    const len = strippedMathString.length;

    while (i < len) {
        const c = strippedMathString.charAt(i++);
        let type;
        let num;

        if (c === '/') {
            type = 0;
        } else if (c === '+') {
            type = 1;
        } else if (c === '-') {
            type = 2;
        } else {
            return undefined;
        }

        if (isNaN(parseInt(strippedMathString.charAt(i), 10))) {
            num = 1;
        } else if (strippedMathString.length === 2) {
            num = parseInt(strippedMathString.charAt(i), 10);
        } else {
            const numFrom = i;
            while (!isNaN(parseInt(strippedMathString.charAt(i), 10))) {
                i++;
                if (i > 10) {
                    return undefined;
                }
            }
            num = parseInt(strippedMathString.substring(numFrom, i), 10);
        }

        if (type === 0) {
            // rounding is only allowed on whole, single, units (eg M or 1M, not 0.5M or 2M)
            if (num !== 1) {
                return undefined;
            }
        }

        const unit = strippedMathString.charAt(i++) as TimeUnit;

        if (validUnits.has(unit)) {
            if (type === 0) {
                if (roundUp) {
                    resultTime = resultTime.endOf(unit);
                } else {
                    resultTime = resultTime.startOf(unit);
                }
            } else if (type === 1) {
                resultTime = resultTime.add(num, unit);
            } else if (type === 2) {
                resultTime = resultTime.subtract(num, unit);
            }
        } else {
            return undefined;
        }
    }

    return resultTime;
}
