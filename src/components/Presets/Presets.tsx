import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';

import type { Preset } from '../../model/type';
import { defaultPresets, datePresets } from '../../model/presets';

import css from './Presets.module.css';

type Props = {
    open: boolean;
    onOpen: (open: boolean) => void;
    onSelectPreset: (preset: Preset) => void;
};

export const Presets = (props: Props) => {
    const { open, onOpen, onSelectPreset } = props;

    const renderPresetList = (presetList: Preset[]) => (
        <div className={css.PresetsList}>
            {presetList.map((preset) => (
                <div key={preset.id} className={css.PresetItem} onClick={() => onSelectPreset(preset)}>
                    <span className={css.PresetTitle}>{preset.title}</span>
                    <span className={css.PresetValue}>{preset.value}</span>
                </div>
            ))}
        </div>
    );

    return (
        <Popover.Root open={open} onOpenChange={onOpen}>
            <Popover.Trigger asChild>
                <button className={css.PresetsButton}>
                    Presets
                    <svg
                        className={css.Chevron}
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="currentColor"
                    >
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className={css.PopoverContent} sideOffset={4} align="start">
                    <Tabs.Root defaultValue="main">
                        <Tabs.List className={css.TabsList}>
                            <Tabs.Trigger className={css.TabTrigger} value="main">
                                Main
                            </Tabs.Trigger>
                            <Tabs.Trigger className={css.TabTrigger} value="other">
                                Other
                            </Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="main">
                            {renderPresetList(datePresets)}
                        </Tabs.Content>
                        <Tabs.Content value="other">
                            {renderPresetList(defaultPresets)}
                        </Tabs.Content>
                    </Tabs.Root>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};
