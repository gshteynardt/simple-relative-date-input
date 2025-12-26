import { useCallback, useRef, useState } from 'react';
import type { InputRef } from 'antd';

import type { Preset } from '../model/type';

type Props = {
    setRelativeText: (text: string) => void;
};

export const useRelativeDateInput = (props: Props) => {
    const { setRelativeText } = props;
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [isPresetsOpen, setPresetsOpen] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setRelativeText(e.target.value);
        },
        [setRelativeText],
    );

    const handleSelectPreset = useCallback(
        (preset: Preset) => {
            setRelativeText(preset.value);
            setPresetsOpen(false);
            inputRef.current?.focus();
        },
        [setRelativeText, setPresetsOpen],
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
        handleSelectPreset,
        handleCalendarClick,
    };
};
