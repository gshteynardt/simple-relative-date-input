import type { TimeUnit } from './date-utils/dateTime/dateTime';
import type { IDateTimeFactory, IDateTime, ParseOptions } from './date-utils/dateTime/types';

const validUnits = new Set<string>(['s', 'm', 'h', 'd', 'w', 'M', 'Q', 'y']);

type DateParseResult = {
    error: string | undefined;
    errorPos: number | undefined;
    ans: IDateTime | null;
};

type Props = {
    text: string;
    dateTime: IDateTimeFactory;
    options?: ParseOptions;
};

class ParseError extends Error {
  pos: number;

  constructor(message: string, pos: number) {
      super(message);
      this.pos = pos;
  }
}

export function parseRelativeDate({ text, dateTime, options }: Props): DateParseResult {
    const EOT = '';
    let pos = 0;
    let ch: string = '';

    const nextChar = () => {
        if (pos < text.length) {
            ch = text[pos];
            pos++;
        } else {
            ch = EOT;
        }
    };

    // Spaces =  {' ' | '\t'}
    const skipSpaces = () => {
        while (ch === ' ' || ch === '\t') {
            nextChar();
        }
    };

    const skipCh = (chLow: string, chUpp: string) => {
        if (ch === chLow || ch === chUpp) {
            nextChar();
        } else {
            throw new ParseError(`"${chLow}" or "${chUpp}" expected`, pos);
        }
    };

    // OptionalInt = ['0'...'9'{'0'...'9'}]
    const optionalInt = (): number => {
        if ('0' <= ch && ch <= '9') {
            const startPos = pos;
            let num = Number(ch);

            nextChar();

            while ('0' <= ch && ch <= '9') {
                num = num * 10 + Number(ch);

                if (num > 1e9) {
                    throw new ParseError('too big int', startPos);
                }

                nextChar();
            }

            return num;
        } else {
            return 1;
        }
    };

    // Unit = 's' | 'm' | 'h' | 'd' | 'w' | 'M' | 'Q' | 'y'
    const readUnit = (): TimeUnit => {
        const unit = ch as TimeUnit;

        if (validUnits.has(unit)) {
            nextChar();

            return unit;
        } else {
            throw new ParseError(`unexpected time unit, allowed: ${Array.from(validUnits).join(', ')}`, pos);
        }
    };

    // RelativeDate = Spaces 'now' Spaces {('-' | '+' | '/') Spaces OptionalInt Spaces Unit Spaces}
    const relativeDate = (): IDateTime => {
        skipSpaces();

        skipCh('n', 'N');
        skipCh('o', 'O');
        skipCh('w', 'W');

        const { timeZone } = options ?? {};
        let time = dateTime.now({ timeZone });

        skipSpaces();

        while (ch === '-' || ch === '+' || ch === '/') {
            const op = ch;

            nextChar();
            skipSpaces();

            const numPos = pos;
            const num = optionalInt();
            skipSpaces();

            const unit = readUnit();
            skipSpaces();

            if (op === '/') {
                if (num !== 1) {
                    throw new ParseError('number should be 1 or missing for operation "/"', numPos);
                }

                time = time.startOf(unit);
            } else if (op === '+') {
                time = time.add(num, unit);
            } else if (op === '-') {
                time = time.subtract(num, unit);
            } else {
                throw new ParseError(`internal error - unexpected operation ${op}`, pos);
            }
        }

        return time;
    };

    try {
        nextChar();
        const ans = relativeDate();

        if (ch !== EOT) {
            throw new ParseError(`unexpected char "${ch}"`, pos - 1);
        }

        return { error: undefined, errorPos: undefined, ans };
    } catch (e) {
        if (e instanceof ParseError) {
            return { error: e.message, errorPos: e.pos, ans: null };
        } else {
            throw e;
        }
    }
}
