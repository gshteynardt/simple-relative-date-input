import { Tooltip, Button } from 'antd';
import { FunctionOutlined } from '@ant-design/icons';

type Props = {
    isRelativeMode: boolean;
    onClick: () => void;
};

export const FxButton = (props: Props) => {
    const { isRelativeMode, onClick } = props;

    return (
        <Tooltip title={isRelativeMode ? 'Switch to absolute date' : 'Switch to relative date'}>
            <Button icon={<FunctionOutlined />} type={isRelativeMode ? 'primary' : 'default'} onClick={onClick} />
        </Tooltip>
    );
};
