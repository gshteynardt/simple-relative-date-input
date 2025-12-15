import { type TimeUnit, type DateTimeOptions, DateTime } from './dateTime.ts';

export const endOf = (date: Date, unit: TimeUnit, options?: DateTimeOptions): Date => {
    return new DateTime(date, options).endOf(unit).toDate();
};
