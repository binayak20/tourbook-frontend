import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useCallback } from 'react';
import { Typography } from '../Typography';
import { PriceWrapper, SupplementWrapper } from './styles';

export type SupplementProps = {
	item: API.Supplement;
	onRemove?: (ID: number) => void;
};

export const Supplement: FC<SupplementProps> = ({ item, onRemove }) => {
	const handleDelete = useCallback(() => {
		onRemove?.(item.id);
	}, [onRemove, item.id]);

	return (
		<SupplementWrapper>
			<PriceWrapper>
				<Typography.Paragraph>SEK</Typography.Paragraph>
				<Typography.Text style={{ fontSize: 12 }}>{item.price || 0}</Typography.Text>
			</PriceWrapper>
			<div style={{ lineHeight: '20px' }}>
				<Typography.Paragraph style={{ color: '#20519e' }}>{item.name}</Typography.Paragraph>
				<Typography.Text style={{ fontSize: 14, color: '#6d7986' }}>
					{item?.supplement_category?.name}
				</Typography.Text>
			</div>
			<Button danger type='link' icon={<DeleteOutlined />} onClick={handleDelete} />
		</SupplementWrapper>
	);
};
