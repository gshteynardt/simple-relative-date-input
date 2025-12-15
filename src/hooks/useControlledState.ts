import { useState, useCallback, useEffect } from 'react';

export interface UseControlledStateOptions<T> {
    /** Controlled value */
    value?: T;
    /** Default value for uncontrolled mode */
    defaultValue?: T;
    /** Callback when value changes */
    onChange?: (value: T) => void;
}

export type UseControlledStateResult<T> = [T, (value: T) => void];

export function useControlledState<T>(
    options: UseControlledStateOptions<T>,
): UseControlledStateResult<T> {
    const { value: controlledValue, defaultValue, onChange } = options;

    const isControlled = controlledValue !== undefined;

    const [internalValue, setInternalValue] = useState<T>(() => {
        return controlledValue ?? defaultValue!;
    });

    useEffect(() => {
        if (isControlled) {
            setInternalValue(controlledValue);
        }
    }, [isControlled, controlledValue]);

    const setValue = useCallback(
        (newValue: T) => {
            if (!isControlled) {
                setInternalValue(newValue);
            }
            onChange?.(newValue);
        },
        [isControlled, onChange],
    );

    return [isControlled ? controlledValue : internalValue, setValue];
}
