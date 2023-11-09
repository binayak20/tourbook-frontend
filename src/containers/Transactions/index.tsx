import { Typography } from '@/components/atoms';
import { DataTableWrapper } from '@/components/atoms/DataTable/DataTableWrapper';
import config from '@/config';
import { transactionsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { convertToCurrency, getColorForStatus, getPaginatedParams } from '@/utils/helpers';
import { Badge, Col, Empty, Row, Table, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { TransactionFilters } from './TransactionFilters';

export const Transactions = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const transactionListParams: API.TransactionsParams = useMemo(() => {
		return {
			page: current,
			limit: pageSize,
			name: searchParams.get('name') || undefined,
			payment_status: searchParams.get('status') || undefined,
			payment_method: searchParams.get('payment_method') || undefined,
			booking_reference: searchParams.get('booking_reference') || undefined,
			from_date: searchParams.get('from_date') || undefined,
			to_date: searchParams.get('to_date') || undefined,
		};
	}, [current, searchParams, pageSize]);

	const { data, isLoading } = useQuery(['transactions', transactionListParams], () =>
		transactionsAPI.list(transactionListParams)
	);

	const transactionDownloadParams: API.TransactionsParams = useMemo(() => {
		return {
			name: searchParams.get('name') || undefined,
			payment_status: searchParams.get('status') || undefined,
			payment_method: searchParams.get('payment_method') || undefined,
			booking_reference: searchParams.get('booking_reference') || undefined,
			from_date: searchParams.get('from_date') || undefined,
			to_date: searchParams.get('to_date') || undefined,
		};
	}, [searchParams]);

	const downloadFile = (data: Blob, filename: string) => {
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(data);
		link.download = filename;
		document.body.append(link);
		link.click();
		link.remove();
	};

	const { mutate: mutateDownloadTransactions } = useMutation(
		() => transactionsAPI.downloadTransactionsReport(transactionDownloadParams),
		{
			onSuccess: (data) => {
				const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
				downloadFile(data, `Transactions-report-${timestamp}.xlsx`);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handlePageChange = useCallback(
		(page: number, size: number) => {
			const params = getPaginatedParams(searchParams, page, size);
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const columns: ColumnsType<API.Transactions> = [
		{
			ellipsis: true,
			title: t('Customer'),
			dataIndex: 'first_name',
			render: (text, record) => `${record.first_name} ${record.last_name}`,
		},
		{
			align: 'center',
			title: t('Booking Ref.'),
			dataIndex: 'booking_ref',
			render: (_, record) => {
				const bookingURL = `/dashboard/${PRIVATE_ROUTES.BOOKINGS_UPDATE.replace(
					':id',
					record.booking.id.toString()
				)}`;
				return <Link to={bookingURL}>{record.booking.reference}</Link>;
			},
		},
		{
			title: t('Date'),
			dataIndex: 'created_at',
			render: (created_at) => moment(created_at).format(config.dateTimeFormatReadable),
		},
		{
			align: 'center',
			title: t('Status'),
			dataIndex: 'status',
			render: (status) => (
				<Badge
					style={{
						fontSize: 14,
						textTransform: 'capitalize',
						backgroundColor: getColorForStatus(status),
					}}
					count={status}
				/>
			),
		},
		{
			title: t('Amount'),
			dataIndex: 'amount',
			render: (amount, record) => `${convertToCurrency(amount, record?.currency?.currency_code)}`,
		},
		{
			title: t('Paid by'),
			dataIndex: 'payment_method',
			render: (payment_method) => <Typography.Text>{payment_method.name}</Typography.Text>,
		},
		{
			width: 180,
			align: 'center',
			title: t('Sent to Fortnox'),
			dataIndex: 'is_sent_to_fortnox',
			render: (is_sent_to_fortnox) => (
				<Typography.Text>{is_sent_to_fortnox ? t('Yes') : t('No')}</Typography.Text>
			),
		},
	];

	return (
		<DataTableWrapper
			filterBar={<TransactionFilters downloadFunction={mutateDownloadTransactions} />}
			title={t('Transactions')}
			count={data?.count}
		>
			<Table
				locale={{
					emptyText: (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={<span>{t('No results found')}</span>}
						/>
					),
				}}
				dataSource={data?.results || []}
				columns={columns}
				expandable={{
					expandedRowRender: (record) => {
						return (
							<Row style={{ backgroundColor: 'aliceblue', padding: '3px' }}>
								<Col span={12}>
									<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
										{`${t('Order ID')}: `}
									</Typography.Title>{' '}
									{record.order_id}
								</Col>
								<Col span={12}>
									<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
										{`${t('Tour')}: `}
									</Typography.Title>
									{record.tour.name}
								</Col>
								{(record?.first_name || record?.payment_address?.family_name) && (
									<Col span={12}>
										<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
											{`${t(`First name`)}: `}
										</Typography.Title>
										{record.first_name ?? record.payment_address?.family_name}
									</Col>
								)}
								{(record?.last_name || record?.payment_address?.given_name) && (
									<Col span={12}>
										<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
											{`${t(`Last name`)}: `}
										</Typography.Title>
										{record.last_name ?? record.payment_address?.given_name}
									</Col>
								)}
								{(record?.email || record?.payment_address?.email) && (
									<Col span={12}>
										<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
											{`${t(`Email`)}: `}
										</Typography.Title>
										{record.email ?? record?.payment_address?.email}
									</Col>
								)}
								<Col span={24}>
									<Row>
										{record.fortnox_voucher && (
											<Col span={12}>Fortnox voucher: {record.fortnox_voucher}</Col>
										)}
									</Row>
								</Col>
							</Row>
						);
					},
				}}
				rowKey='id'
				pagination={{
					locale: { items_per_page: `/\t${t('page')}` },
					pageSize: pageSize,
					current: current,
					total: data?.count || 0,
					onChange: handlePageChange,
					showSizeChanger: true,
				}}
				scroll={{ y: 'auto' }}
				loading={isLoading}
			/>
		</DataTableWrapper>
	);
};
