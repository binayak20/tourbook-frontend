import { bookingsAPI } from '@/libs/api';
import { Badge, Empty, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import FortnoxLogExpand from './FortnoxLogExpand';

const FortnoxLog = () => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const { data, isLoading, isError } = useQuery(
		['bookingFortnoxLogs'],
		() => bookingsAPI.fortnoxLogs(id as unknown as string),
		{
			enabled: !!id,
		}
	);
	const columns: ColumnsType<API.FortnoxLog> = [
		{
			title: t('Voucher number'),
			dataIndex: 'voucher_number',
			render: (value, record) => `${record?.voucher_series}${value}`,
		},
		{
			title: t('Order ID'),
			dataIndex: 'transaction',
			render: (transaction) => (transaction ? transaction[0]?.order_id : '-'),
		},
		{
			title: t('Fortnox event'),
			dataIndex: 'fortnox_event',
		},
		{
			width: 150,
			title: t('Status'),
			dataIndex: 'is_success',
			align: 'center',
			render: (isSuccess: boolean) =>
				isSuccess ? (
					<Badge count={t('Success')} status='success' />
				) : (
					<Badge count={t('Failed')} status='error' />
				),
		},
	];
	if (isError) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					rowKey='id'
					loading={isLoading}
					columns={columns}
					tableLayout='fixed'
					expandable={{
						expandedRowRender: (record) => <FortnoxLogExpand log={record} />,
					}}
					dataSource={data}
					pagination={false}
				/>
			</div>
		</div>
	);
};

export default FortnoxLog;
