import { useState, useRef, useCallback, useMemo, useImperativeHandle, type Ref } from 'react';
import { Input, DatePicker, Tooltip, Button, Space } from 'antd';
import type { InputRef } from 'antd';
import { CalendarOutlined, FunctionOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import cn from 'classnames';

import { useSimpleRelativeDateState } from '../../hooks/useSimpleRelativeDateState';
import { Presets } from '../Presets/Presets';
import type { Preset, Value } from '../../model/type';
import css from './RelativeDateInput.module.css';

type Props = {
    /** Current value (relative or absolute) */
    value: Value | undefined;
    /** Default value */
    defaultValue?: Value | null;
    /** Callback when value changes */
    onUpdate?: (value: Value | null) => void;
    /** Placeholder text for relative mode */
    placeholder?: string;
    /** Additional CSS class */
    className?: string;
    /** Ref to the input element */
    ref?: Ref<InputRef>;
};

export const RelativeDateInput = (props: Props) => {
    const { value, defaultValue, onUpdate, placeholder = 'now-5d', className, ref } = props;

    const state = useSimpleRelativeDateState({ value, defaultValue, onUpdate });
    const { mode, relativeDate, setRelativeDate, parsedDate, isValid, errorMessage, onToggleMode, setDateValue } = state;

    const [isCalendarOpen, setCalendarOpen] = useState(false);
    const [isPresetsOpen, setPresetsOpen] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => inputRef.current!, []);

    const isRelativeMode = mode === 'relative';

    // Convert parsed DateTime to Dayjs for Ant Design DatePicker
    const dayjsDate = useMemo(() => {
        return parsedDate ? dayjs(parsedDate.toDate()) : null;
    }, [parsedDate]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setRelativeDate(e.target.value);
        },
        [setRelativeDate],
    );

    const handleDateSelect = useCallback(
        (date: dayjs.Dayjs | null) => {
            if (date) {
                setDateValue({ type: 'absolute', value: date.toDate() });
            }
            setCalendarOpen(false);
        },
        [setDateValue],
    );

    const handleCalendarClick = useCallback(() => {
        setCalendarOpen((prev) => !prev);
    }, []);

    const handleModeToggle = useCallback(() => {
        onToggleMode();
        setDateValue(null);
    }, [onToggleMode, setDateValue]);

    const handlePresetSelect = useCallback(
        (preset: Preset) => {
            setRelativeDate(preset.value);
            setPresetsOpen(false);
            inputRef.current?.focus();
        },
        [setRelativeDate],
    );

    const suffix = (
        <Tooltip title={parsedDate ? `Resolved: ${parsedDate.toISOString()}` : 'Open calendar'}>
            <span
                className={cn(css.CalendarIcon, {
                    [css.CalendarIconValid]: parsedDate,
                    [css.CalendarIconInvalid]: relativeDate && !isValid,
                })}
                onClick={handleCalendarClick}
            >
                <CalendarOutlined />
            </span>
        </Tooltip>
    );

    return (
        <div className={cn(css.RelativeDateInput, className)} ref={containerRef}>
            <Space.Compact>
                <Tooltip title={isRelativeMode ? 'Switch to absolute date' : 'Switch to relative date'}>
                    <Button
                        icon={<FunctionOutlined />}
                        type={isRelativeMode ? 'primary' : 'default'}
                        onClick={handleModeToggle}
                        className={css.FxButton}
                    />
                </Tooltip>
                {isRelativeMode && (
                    <Presets open={isPresetsOpen} onOpen={setPresetsOpen} onSelectPreset={handlePresetSelect} />
                )}
                {isRelativeMode ? (
                    <Input
                        ref={inputRef}
                        value={relativeDate}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        suffix={suffix}
                        status={!isValid && relativeDate ? 'error' : undefined}
                        className={css.Input}
                    />
                ) : (
                    <DatePicker
                        value={dayjsDate}
                        onChange={handleDateSelect}
                        className={css.DatePickerInput}
                        placeholder="Select date"
                    />
                )}
            </Space.Compact>

            {/* Hidden DatePicker for calendar popup in relative mode */}
            {isRelativeMode && (
                <DatePicker
                    open={isCalendarOpen}
                    value={dayjsDate}
                    onChange={handleDateSelect}
                    onOpenChange={setCalendarOpen}
                    className={css.HiddenDatePicker}
                    getPopupContainer={() => containerRef.current || document.body}
                    classNames={{ popup: css.CalendarPopup }}
                />
            )}

            {isRelativeMode && errorMessage && <div className={css.Error}>{errorMessage}</div>}
            {isRelativeMode && parsedDate && <div className={css.Preview}>Resolved: {parsedDate.format()}</div>}
        </div>
    );
};
