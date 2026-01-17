import type { ChangeEvent, RefObject } from 'react';

import cn from 'classnames';
import { Presets } from '../Presets/Presets';

import css from './RelativeDateInput.module.css';
import type { Preset } from '../../model/type';

type Props = {
  placeholder: string;
  relativeText: string;
  isPresetsOpen: boolean;
  error: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onOpenPresets: (open: boolean) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSelectPreset: (preset: Preset) => void;
};

export const RelativeDateInput = (props: Props) => {
  const { placeholder, relativeText, inputRef, isPresetsOpen, error, onOpenPresets, onSelectPreset, onChange } = props;

  return (
    <div className={css.RelativeDateInput}>
      <Presets open={isPresetsOpen} onOpen={onOpenPresets} onSelectPreset={onSelectPreset} />
      <div className={cn(css.InputWrapper, { [css.InputError]: error })}>
        <span className={css.InputPrefix}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <text x="2" y="18" fontSize="16" fontStyle="italic" strokeWidth="0" fill="currentColor">fx</text>
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          className={css.Input}
          placeholder={placeholder}
          value={relativeText}
          onChange={onChange}
        />
      </div>
    </div>
  )
};
