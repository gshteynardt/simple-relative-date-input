import { Button, Popover, Tabs } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import type { Preset } from '../../model/type';
import css from './Presets.module.css';
import { DEFAULT_PRESETS, DATE_PRESETS } from '../../utils/presets.ts';

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

    const dropdownContent = (
        <div className={css.DropdownContent}>
            <Tabs
                defaultActiveKey="main"
                size="small"
                items={[
                    {
                        key: 'main',
                        label: 'Main',
                        children: renderPresetList(DATE_PRESETS),
                    },
                    {
                        key: 'other',
                        label: 'Other',
                        children: renderPresetList(DEFAULT_PRESETS),
                    },
                ]}
            />
        </div>
    );

    return (
        <Popover
            open={open}
            onOpenChange={onOpen}
            content={dropdownContent}
            trigger={['click']}
            placement="bottomLeft"
            arrow={false}
        >
            <Button className={css.PresetsButton}>
                Presets <DownOutlined className={css.Chevron} />
            </Button>
        </Popover>
    );
};
