import { useState, useCallback } from 'react';
import { DatePicker, Space } from 'antd';
import type { Dayjs } from 'dayjs';

import cn from 'classnames';
import css from './SimpleRelativeDateInput.module.css';

import type { UseSimpleRelativeDateStateOptions } from '../../model/type';
import { useSimpleRelativeDateState } from '../../hooks/useSimpleRelativeDateState';
import { RelativeDateInput } from '../RelativeDateInput.1/RelativeDateInput';
import { FxButton } from '../FxButton/FxButton';

type Props = {
    /** placeholder */
    placeholder?: string;
    /** CSS class */
    className?: string;
} & UseSimpleRelativeDateStateOptions;

export const SimpleRelativeDateInput = (props: Props) => {
    const { placeholder = 'e.g. now-1d, now+1w', className = '' } = props;

    const state = useSimpleRelativeDateState(props);

    const { mode, onToggleMode, relativeDate, setRelativeDate, setDateValue, parsedDate, isValid, errorMessage } =
        state;

    const absoluteDateMode = mode === 'absolute';
    const relativeDateMode = mode === 'relative';

    const [absoluteDate, setAbsoluteDate] = useState<Dayjs | null>(null);

    const handleFxClick = useCallback(() => {
        onToggleMode();

        if (!absoluteDateMode) {
            setRelativeDate('');
        }
    }, [onToggleMode, absoluteDateMode, setRelativeDate]);

    return (
        <div className={cn(className, css.SimpleRelativeDateInput)}>
            <Space.Compact>
                <FxButton isRelativeMode={relativeDateMode} onClick={handleFxClick} />
                {absoluteDateMode && (
                    <DatePicker
                        value={absoluteDate}
                        onChange={setAbsoluteDate}
                        className={css.DatePicker}
                    />
                )}
                {relativeDateMode && (
                    <RelativeDateInput
                        relativeDate={relativeDate}
                        parsedDate={parsedDate}
                        isValid={isValid}
                        errorMessage={errorMessage}
                        setRelativeDate={setRelativeDate}
                        setDateValue={setDateValue}
                        onToggleMode={onToggleMode}
                        placeholder={placeholder}
                    />
                )}
            </Space.Compact>
        </div>
    );
};
