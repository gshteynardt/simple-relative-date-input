import { useCallback, useRef, useState } from 'react';

import type { Preset } from '../model/type';

type Props = {
    setRelativeText: (text: string) => void;
};

export const useRelativeDateInput = (props: Props) => {
    const { setRelativeText } = props;
    const [isPresetsOpen, setPresetsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
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

    return {
        isPresetsOpen,
        inputRef,
        containerRef,
        setPresetsOpen,
        handleChange,
        handleSelectPreset,
    };
};
