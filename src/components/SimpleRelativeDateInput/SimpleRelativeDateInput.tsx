import { useSimpleRelativeDateState } from '../../hooks/useSimpleRelativeDateState';
import { RelativeDate } from '../RelativeDate/RelativeDate';
import { dateTime } from '../../lib/date-utils/dateTime/dateTime';

export const SimpleRelativeDateInput = () => {
    const state = useSimpleRelativeDateState({ dateTime });
    const { relativeText, setRelativeText, parsedDate, isValid, errorMessage, errorPosition } = state;

    return (
        <RelativeDate
            relativeText={relativeText}
            parsedDate={parsedDate}
            isValid={isValid}
            errorMessage={errorMessage}
            errorPosition={errorPosition}
            setRelativeText={setRelativeText}
            placeholder="now-5d"
        />
    );
};
