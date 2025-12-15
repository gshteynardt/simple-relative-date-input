import { Input, DatePicker, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import cn from 'classnames';

import { Presets } from '../Presets/Presets';
import type { Value } from '../../model/type';
import css from './RelativeDateInput.module.css';
import type { DateTime } from '../../utils/date-utils/dateTime';
import { useRelativeDateInput } from '../../hooks/useRelativeDateInput.ts';

type Props = {
    placeholder?: string;
    relativeDate: string;
    parsedDate: DateTime | undefined;
    isValid: boolean;
    errorMessage: string | undefined;
    setRelativeDate: (text: string) => void;
    setDateValue: (value: Value | null) => void;
    onToggleMode: () => void;
};

export const RelativeDateInput = (props: Props) => {
    const {
        relativeDate,
        parsedDate,
        isValid,
        errorMessage,
        placeholder = 'now-5d',
        setRelativeDate,
        setDateValue,
    } = props;

    const {
        isCalendarOpen,
        isPresetsOpen,
        inputRef,
        containerRef,
        setPresetsOpen,
        setCalendarOpen,
        handleChange,
        handleSelectDate,
        handleSelectPreset,
        handleCalendarClick,
    } = useRelativeDateInput({ setRelativeDate, setDateValue });

    const suffix = (
        <span className={css.CalendarIcon} onClick={handleCalendarClick}>
            <CalendarOutlined />
        </span>
    );

    return (
        <div className={cn(css.RelativeDateInput)} ref={containerRef}>
            <Space.Compact>
                <Presets open={isPresetsOpen} onOpen={setPresetsOpen} onSelectPreset={handleSelectPreset} />
                <Input
                    ref={inputRef}
                    value={relativeDate}
                    onChange={handleChange}
                    placeholder={placeholder}
                    suffix={suffix}
                    status={!isValid && relativeDate ? 'error' : undefined}
                    className={css.Input}
                />
            </Space.Compact>
            <DatePicker
                classNames={{ popup: css.CalendarPopup }}
                className={css.HiddenDatePicker}
                open={isCalendarOpen}
                value={parsedDate?.toDayJs()}
                getPopupContainer={() => containerRef.current ?? document.body}
                onChange={handleSelectDate}
                onOpenChange={setCalendarOpen}
            />
            {errorMessage && <div className={css.Error}>{errorMessage}</div>}
            {parsedDate && <div className={css.Preview}>Resolved: {parsedDate.format()}</div>}
        </div>
    );
};
