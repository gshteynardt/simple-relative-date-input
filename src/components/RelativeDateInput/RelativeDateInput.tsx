import { Input, DatePicker, Space } from 'antd';
import { CalendarOutlined, FunctionOutlined } from '@ant-design/icons';
import cn from 'classnames';

import { Presets } from '../Presets/Presets';
import { Error } from '../Error/Error';
import { useRelativeDateInput } from '../../hooks/useRelativeDateInput';
import type { IDateTime } from '../../lib/date-utils/dateTime/types';

import css from './RelativeDateInput.module.css';

type Props = {
    placeholder: string;
    relativeText: string;
    parsedDate: IDateTime | null;
    isValid: boolean;
    errorMessage: string | undefined;
    errorPosition: number | undefined;
    setRelativeText: (text: string) => void;
};

export const RelativeDateInput = (props: Props) => {
    const { placeholder, relativeText, parsedDate, isValid, errorMessage, errorPosition, setRelativeText } = props;

    const {
        isCalendarOpen,
        isPresetsOpen,
        inputRef,
        containerRef,
        setPresetsOpen,
        setCalendarOpen,
        handleChange,
        handleSelectPreset,
        handleCalendarClick,
    } = useRelativeDateInput({ setRelativeText });

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
                    placeholder={placeholder}
                    ref={inputRef}
                    value={relativeText}
                    onChange={handleChange}
                    prefix={<FunctionOutlined />}
                    suffix={suffix}
                    status={!isValid && relativeText ? 'error' : undefined}
                    className={css.Input}
                />
            </Space.Compact>
            <DatePicker
                classNames={{ popup: css.CalendarPopup }}
                className={css.HiddenDatePicker}
                open={isCalendarOpen}
                value={parsedDate?.toDayJs()}
                getPopupContainer={() => containerRef.current ?? document.body}
                onOpenChange={setCalendarOpen}
            />
            {errorMessage && errorPosition !== undefined && (
                <Error errorMessage={errorMessage} relativeText={relativeText} errorPosition={errorPosition} />
            )}
            {parsedDate && <div className={css.Preview}>Resolved: {parsedDate.format()}</div>}
        </div>
    );
};
