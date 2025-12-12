import { Input, Button, Dropdown } from 'antd';
import { FunctionOutlined } from '@ant-design/icons';
import cn from 'classnames';
import css from './SimpleRelativeDateInput.module.css';

import type { Preset } from '../../model/type';

type Props = {
    /** placeholder */
    placeholder?: string;
    /** show presets in dropdown */
    withPresets?: boolean;
    /** custom presets */
    presets?: Preset[];
    /** show preview date */
    showPreview?: boolean;
    /** render custom component when f(x) is not active */
    renderAbsoluteMode?: (props: {
        value: Date | null;
        onChange: (value: Date | null) => void;
    }) => React.ReactNode;
    /** CSS class */
    className?: string;
};

export const SimpleRelativeDateInput = (props: Props) => {
  const { placeholder = 'Select date', withPresets = true, presets = [], showPreview = true, renderAbsoluteMode = () => null, className = '' } = props;

  return <div className={cn(className, css.SimpleRelativeDateInput)}><Button icon={<FunctionOutlined />} /> <Input placeholder={placeholder} /></div>;
};
