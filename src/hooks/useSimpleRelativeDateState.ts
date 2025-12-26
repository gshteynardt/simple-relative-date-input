import { useState, useMemo } from 'react';

import { parseRelativeDate } from '../lib/relativeDateParser';
import type { DateTimeFactory, IDateTime } from '../lib/date-utils/dateTime/types';

type SimpleRelativeDateState = {
    /** current relative text */
    relativeText: string;
    /** parsed date (for preview) */
    parsedDate: IDateTime | null;
    /** set relative text */
    setRelativeText: (relativeText: string) => void;
    /** is current value valid */
    isValid: boolean;
    /** error message */
    errorMessage: string | undefined;
    /** error position for cursor */
    errorPosition: number | undefined;
};

type Props = {
    dateTime: DateTimeFactory;
};

export const useSimpleRelativeDateState = (props: Props): SimpleRelativeDateState => {
    const { dateTime } = props;
    const [text, setText] = useState<string>('');

    const parsedDate = useMemo(() => {
        return parseRelativeDate({ text, dateTime });
    }, [text]);

    const { error, errorPos, ans } = parsedDate;
    const isValid = !Boolean(error);
    const errorMessage = text ? error : undefined;
    const errorPosition = errorPos;

    return {
        relativeText: text,
        parsedDate: ans,
        setRelativeText: setText,
        errorMessage,
        errorPosition,
        isValid,
    };
};
