import { Typography } from '@/components/atoms';
import { Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';

function DiscountList({
	discount_histories,
	isLoading = false,
}: {
	discount_histories: [];
	isLoading: boolean;
}) {
	const { t } = useTranslation();

	const columns: ColumnsType<API.TourDiscount> = [
		{
			title: t('Discount type'),
			dataIndex: 'discount_type',
		},
		{
			title: t('Discount value'),
			dataIndex: 'discount_value',
			render: (value) => {
				return value || '-';
			},
		},
		{
			title: t('Note'),
			dataIndex: 'note',
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: '20px' }}>
				<Typography.Title level={5}>{t('Discount history')}</Typography.Title>
			</Space>
			<Table
				scroll={{ y: '400px' }}
				rowKey='updated_at'
				dataSource={discount_histories}
				loading={isLoading}
				columns={columns}
			/>
		</div>
	);
}

export default DiscountList;
