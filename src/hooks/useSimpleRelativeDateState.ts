import { useState, useCallback, useMemo } from 'react';

import type { UseSimpleRelativeDateStateOptions, Value } from '../model/type';
import { useControlledState } from './useControlledState';
import { isRelativeDate, isValidRelativeDate, parseRelativeDate } from '../utils/relativeDateParser';
import type { DateTime } from '../utils/date-utils/dateTime';

export type SimpleRelativeDateState = {
    /** current value */
    value: Value | null;
    /** set value */
    setDateValue: (value: Value | null) => void;
    /** current mode: relative (f(x) is active) or absolute */
    mode: 'relative' | 'absolute';
    /** switch mode */
    onToggleMode: () => void;
    /** relative date in input */
    relativeDate: string;
    /** set text */
    setRelativeDate: (relativeDate: string) => void;
    /** parsed date (for preview) */
    parsedDate: DateTime | undefined;
    /** is current value valid */
    isValid: boolean;
    /** error message */
    errorMessage: string | undefined;
};

export const useSimpleRelativeDateState = (props: UseSimpleRelativeDateStateOptions): SimpleRelativeDateState => {
    const { value = null, defaultValue = null, onUpdate } = props;

    const [internalValue, setInternalValue] = useControlledState({
        value,
        defaultValue,
        onChange: onUpdate,
    });

    const [mode, setModeInternal] = useState<'relative' | 'absolute'>(internalValue?.type ?? 'relative');

    const [text, setTextInternal] = useState<string>(internalValue?.type === 'relative' ? internalValue.value : '');

    const onToggleMode = useCallback(() => {
        setModeInternal(mode === 'relative' ? 'absolute' : 'relative');
    }, [mode, setModeInternal]);

    const setText = useCallback(
        (newText: string) => {
            setTextInternal(newText);

            if (!newText) {
                setInternalValue(null);
                return;
            }

            if (isValidRelativeDate(newText)) {
                setInternalValue({ type: 'relative', value: newText });
            }
        },
        [setInternalValue],
    );

    const parsedDate = useMemo(() => {
        if (!text || !isRelativeDate(text)) {
            return;
        }

        return parseRelativeDate(text);
    }, [text]);

    const isValid = useMemo(() => {
        if (!text) {
            return false;
        }

        return isValidRelativeDate(text);
    }, [text]);

    const errorMessage = useMemo(() => {
        if (!text) {
            return;
        }

        if (!isRelativeDate(text)) {
            return 'Expression must start with "now"';
        }

        if (!isValidRelativeDate(text)) {
            return 'Invalid format. Examples: now, now-5m, now-1d, now/d, now-1d/d';
        }

        return;
    }, [text]);

    return {
        value: internalValue,
        mode,
        relativeDate: text,
        setDateValue: setInternalValue,
        setRelativeDate: setText,
        onToggleMode,
        parsedDate,
        isValid,
        errorMessage,
    };
};
