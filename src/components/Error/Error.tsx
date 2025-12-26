import css from './Error.module.css';

type Props = {
    errorMessage: string;
    relativeText: string;
    errorPosition: number;
};

export const Error = (props: Props) => {
    const { errorMessage, relativeText, errorPosition } = props;

    return (
        <div className={css.Error}>
            <div className={css.ErrorMessage}>{errorMessage}</div>
            <div className={css.ErrorText}>
                {relativeText.slice(0, errorPosition)}
                <span className={css.Cursor} />
                {relativeText.slice(errorPosition)}
            </div>
        </div>
    );
};
