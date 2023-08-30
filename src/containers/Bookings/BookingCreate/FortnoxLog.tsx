import { bookingsAPI } from '@/libs/api';
import { Empty, Table } from 'antd';
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
			render: (value, record) =>
				value
					? `${record?.voucher_series}${value}`
					: JSON.parse(record?.request_body)?.Invoice?.invoice_number,
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
			title: t('Posting date'),
			dataIndex: 'response',
			align: 'center',
			render: (value) =>
				JSON.parse(value)?.Voucher?.TransactionDate || JSON.parse(value)?.Invoice?.OutboundDate,
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
						expandedRowRender: (record) => (
							<FortnoxLogExpand log={record} isInvoice={JSON.parse(record?.response)?.Invoice} />
						),
					}}
					dataSource={data}
					pagination={false}
				/>
			</div>
		</div>
	);
};

export default FortnoxLog;
