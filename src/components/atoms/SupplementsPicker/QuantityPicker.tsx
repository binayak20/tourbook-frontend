import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import { FC } from 'react';
import { QuantityWrapper } from './styles';

type QuantityPickerProps = {
	stock?: number;
	count?: number;
	onIncrement?: () => void;
	onDecrement?: () => void;
};

export const QuantityPicker: FC<QuantityPickerProps> = ({
	stock = 0,
	count = 0,
	onIncrement,
	onDecrement,
}) => (
	<QuantityWrapper>
		<Button
			size='small'
			aria-label='Decrement value'
			onClick={onDecrement}
			icon={<MinusOutlined style={{ fontSize: 12 }} />}
			disabled={count <= 0}
		/>
		<Typography.Text>{count}</Typography.Text>
		<Button
			size='small'
			aria-label='Increment value'
			onClick={onIncrement}
			icon={<PlusOutlined style={{ fontSize: 12 }} />}
			disabled={count >= stock}
		/>
	</QuantityWrapper>
);
