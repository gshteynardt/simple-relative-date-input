import { DateTime } from './dateTime.ts';

export const formatDate = (date: Date, options?: {format?: string; timeZone?: string}): string => {
    const dt = new DateTime(date, { timeZone: options?.timeZone });

    return dt.format(options?.format);
};
