import { DayPicker } from 'react-day-picker';

import cn from 'classnames';

import { Error } from '../Error/Error';
import { RelativeDateInput } from '../RelativeDateInput/RelativeDateInput';
import { useRelativeDateInput } from '../../hooks/useRelativeDateInput';
import type { IDateTime } from '../../lib/date-utils/dateTime/types';

import css from './RelativeDate.module.css';
import 'react-day-picker/style.css';

type Props = {
  placeholder: string;
  relativeText: string;
  parsedDate: IDateTime | null;
  isValid: boolean;
  errorMessage: string | undefined;
  errorPosition: number | undefined;
  setRelativeText: (text: string) => void;
};

export const RelativeDate = (props: Props) => {
  const { placeholder, relativeText, parsedDate, isValid, errorMessage, errorPosition, setRelativeText } = props;

  const {
    isPresetsOpen,
    inputRef,
    containerRef,
    setPresetsOpen,
    handleChange,
    handleSelectPreset,
  } = useRelativeDateInput({ setRelativeText });

  const hasError = Boolean(!isValid && relativeText);

  return (
    <div className={cn(css.RelativeDate)} ref={containerRef}>
      <RelativeDateInput
        placeholder={placeholder}
        relativeText={relativeText}
        inputRef={inputRef}
        isPresetsOpen={isPresetsOpen}
        error={hasError}
        onOpenPresets={setPresetsOpen}
        onSelectPreset={handleSelectPreset}
        onChange={handleChange}
      />
      {errorMessage && errorPosition !== undefined && (
        <Error errorMessage={errorMessage} relativeText={relativeText} errorPosition={errorPosition} />
      )}
      {parsedDate && <div className={css.Preview}>Resolved: {parsedDate.format()}</div>}
      <div className={css.DayPicker}>
        <DayPicker
          mode="single"
          month={parsedDate?.toDate()}
          selected={parsedDate?.toDate()}
          today={parsedDate?.toDate()}
          hideNavigation
        />
      </div>
    </div>
  );
};
