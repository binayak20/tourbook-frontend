import { readableText } from '@/utils/helpers/index';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import { FC, useCallback } from 'react';
import { Typography } from '../Typography';
import { QuantityPicker } from './QuantityPicker';
import { PriceWrapper, SupplementWrapper } from './styles';

export type SupplementProps = {
	item: API.Supplement & { selectedquantity: number };
	onRemove?: (ID: number) => void;
	onIncrement?: (ID: number) => void;
	onDecrement?: (ID: number) => void;
};

export const Supplement: FC<SupplementProps> = ({ item, onRemove, onIncrement, onDecrement }) => {
	const handleDelete = useCallback(() => {
		onRemove?.(item.id);
	}, [onRemove, item.id]);

	const handleIncrement = useCallback(() => {
		onIncrement?.(item.id);
	}, [item.id, onIncrement]);

	const handleDecrement = useCallback(() => {
		const newValue = item.selectedquantity - 1;
		if (newValue <= 0) {
			handleDelete();
			return;
		}

		onDecrement?.(item.id);
	}, [handleDelete, item.id, item.selectedquantity, onDecrement]);

	return (
		<SupplementWrapper>
			<PriceWrapper>
				<Typography.Paragraph>SEK</Typography.Paragraph>
				<Typography.Text style={{ fontSize: 12 }}>{item.price || 0}</Typography.Text>
			</PriceWrapper>
			<div style={{ lineHeight: '20px' }}>
				<Typography.Paragraph style={{ color: '#20519e' }}>{item.name}</Typography.Paragraph>
				<Typography.Text style={{ fontSize: 14, color: '#6d7986' }}>
					{item?.supplement_category?.name}{' '}
					{item?.unit_type ? `(${readableText(item.unit_type)})` : ''}
				</Typography.Text>
			</div>
			<Row justify='end'>
				<Col>
					{['per_booking_person', 'per_day_person', 'per_week_person', 'per_night_person'].includes(
						item.unit_type
					) ? (
						<QuantityPicker
							stock={item?.quantity || 0}
							count={item?.selectedquantity || 0}
							onIncrement={handleIncrement}
							onDecrement={handleDecrement}
						/>
					) : (
						<Button
							danger
							type='link'
							icon={<DeleteOutlined />}
							onClick={handleDelete}
							disabled={item?.is_mandatory}
						/>
					)}
				</Col>
			</Row>
		</SupplementWrapper>
	);
};
