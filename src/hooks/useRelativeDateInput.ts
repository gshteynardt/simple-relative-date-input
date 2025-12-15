import { useCallback, useRef, useState } from 'react';
import type { Dayjs } from 'dayjs';
import type { InputRef } from 'antd';

import type { Preset, Value } from '../model/type';

type Props = {
    setRelativeDate: (text: string) => void;
    setDateValue: (value: Value | null) => void;
};

export const useRelativeDateInput = (props: Props) => {
    const { setRelativeDate, setDateValue } = props;
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [isPresetsOpen, setPresetsOpen] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setRelativeDate(e.target.value);
        },
        [setRelativeDate],
    );

    const handleSelectDate = useCallback(
        (date: Dayjs | null) => {
            if (date) {
                setDateValue({ type: 'absolute', value: date.toDate() });
            }
        },
        [setDateValue],
    );

    const handleSelectPreset = useCallback(
        (preset: Preset) => {
            setRelativeDate(preset.value);
            setPresetsOpen(false);
            inputRef.current?.focus();
        },
        [setRelativeDate, setPresetsOpen],
    );

    const handleCalendarClick = useCallback(() => {
        setCalendarOpen((prev) => !prev);
    }, []);

    return {
        isCalendarOpen,
        isPresetsOpen,
        inputRef,
        containerRef,
        setCalendarOpen,
        setPresetsOpen,
        handleChange,
        handleSelectDate,
        handleSelectPreset,
        handleCalendarClick,
    };
};
