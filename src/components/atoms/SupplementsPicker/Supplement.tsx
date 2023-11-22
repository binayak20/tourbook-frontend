import { useLang } from '@/libs/hooks';
import { getCurrencySymbol, readableText } from '@/utils/helpers/index';
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	DeleteOutlined,
	EditOutlined,
} from '@ant-design/icons';
import { Button, Col, InputNumber, Row, Space, theme } from 'antd';
import { FC, useCallback, useState } from 'react';
import { Typography } from '../Typography';
import { QuantityPicker } from './QuantityPicker';
import { EditPrice, PriceWrapper, SupplementWrapper } from './styles';

export type SupplementProps = {
	item: API.Supplement & { selectedquantity: number };
	onRemove?: (ID: number) => void;
	onIncrement?: (ID: number) => void;
	onDecrement?: (ID: number) => void;
	disabled?: boolean;
	isBooking?: boolean;
	onUpdateSupplementPrice?: (ID: number, price: number) => void;
	currencyCode?: string;
};

export const Supplement: FC<SupplementProps> = ({
	item,
	onRemove,
	onIncrement,
	onDecrement,
	disabled,
	isBooking,
	onUpdateSupplementPrice,
	currencyCode,
}) => {
	const { token } = theme.useToken();
	const [editPrice, setEditPrice] = useState(false);
	const { language } = useLang();
	const currencySymbol = currencyCode ? getCurrencySymbol(language, currencyCode) : null;
	const [supplementPrice, setSupplementPrice] = useState<number | null>(item?.price);
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
		<SupplementWrapper {...{ editPrice }}>
			<PriceWrapper {...{ editPrice }}>
				{editPrice ? (
					<EditPrice>
						<InputNumber
							controls={false}
							value={supplementPrice}
							onChange={(value) => setSupplementPrice(value)}
							addonBefore={currencySymbol}
							size='middle'
						/>
						<Button
							type='link'
							onClick={() => {
								onUpdateSupplementPrice?.(item.id, supplementPrice as number);
								setEditPrice(false);
							}}
							icon={<CheckCircleOutlined />}
						/>
						<Button
							type='link'
							color='danger'
							onClick={() => setEditPrice(false)}
							icon={<CloseCircleOutlined />}
							danger
						/>
					</EditPrice>
				) : (
					<>
						{onUpdateSupplementPrice ? (
							<div className='overlay'>
								<Button onClick={() => setEditPrice(true)} icon={<EditOutlined />} type='link' />
							</div>
						) : null}
						<Typography.Paragraph>{currencySymbol}</Typography.Paragraph>
						<Typography.Text style={{ fontSize: 12 }}>{item.price || 0}</Typography.Text>
					</>
				)}
			</PriceWrapper>

			<div style={{ lineHeight: '20px' }}>
				<Typography.Title noMargin type='primary' level={5} style={{ fontWeight: 'normal' }}>
					{item.name}
				</Typography.Title>
				<Typography.Text style={{ fontSize: 14, color: token.colorTextSecondary }}>
					{item?.supplement_category?.name}{' '}
					{item?.unit_type ? `(${readableText(item.unit_type)})` : ''}
				</Typography.Text>
			</div>
			<Row justify='end'>
				<Col>
					<Space>
						{isBooking &&
							[
								'per_booking_person',
								'per_day_person',
								'per_week_person',
								'per_night_person',
							].includes(item.unit_type) && (
								<QuantityPicker
									isMandatory={item.is_mandatory}
									stock={item?.quantity || 0}
									count={item?.selectedquantity || 0}
									onIncrement={handleIncrement}
									onDecrement={handleDecrement}
									disabled={disabled}
								/>
							)}
						<Button
							danger
							type='link'
							icon={<DeleteOutlined />}
							onClick={handleDelete}
							disabled={disabled || (isBooking && item?.is_mandatory)}
						/>
					</Space>
				</Col>
			</Row>
		</SupplementWrapper>
	);
};
