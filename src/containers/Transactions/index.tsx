import { Typography } from '@/components/atoms';
import config from '@/config';
import { transactionsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getColorForStatus, readableText } from '@/utils/helpers';
import { Badge, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FilterTransactions } from './FilterTransactions';

export const Transactions = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const currentPage = useMemo(() => parseInt(searchParams.get('page') || '1'), [searchParams]);

	const params: API.TransactionsParams = useMemo(() => {
		return {
			page: currentPage,
			name: searchParams.get('name') || undefined,
			status: searchParams.get('status') || undefined,
			payment_method: searchParams.get('payment_method') || undefined,
		};
	}, [currentPage, searchParams]);

	const { data, isLoading } = useQuery(['transactions', params], () =>
		transactionsAPI.list(params)
	);

	const handlePageChange = useCallback(
		(page: number) => {
			navigate(page > 1 ? `?page=${page}` : '');
		},
		[navigate]
	);

	const columns: ColumnsType<API.Transactions> = [
		{
			width: 200,
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
			render: (amount, record) => `${amount} ${record.currency.currency_code}`,
		},
		{
			title: t('Paid by'),
			dataIndex: 'payment_method',
			render: (payment_method) => <Typography.Text>{payment_method.name}</Typography.Text>,
		},
		{
			align: 'center',
			title: t('Sent to Fortnox'),
			dataIndex: 'is_sent_to_fortnox',
			render: (is_sent_to_fortnox) => (
				<Typography.Text>{is_sent_to_fortnox ? t('Yes') : t('No')}</Typography.Text>
			),
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Transactions')}
					</Typography.Title>
				</Col>
			</Row>

			<FilterTransactions />

			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					dataSource={data?.results || []}
					columns={columns}
					expandable={{
						expandedRowRender: (record) => {
							return (
								<Row>
									<Col span={12}>Tour: {record.tour.name}</Col>
									<Col span={12}>Order ID: {record.order_id}</Col>
									<Col span={24}>
										<Row>
											{record.payment_address &&
												(
													Object.keys(
														record.payment_address
													) as (keyof API.Transactions['payment_address'])[]
												).map((key) => {
													const value = record.payment_address?.[key];
													if (!value) return null;

													return (
														<Col span={4} key={key}>
															{readableText(key)}: {record.payment_address?.[key]}
														</Col>
													);
												})}
											{record.fortnox_voucher && (
												<Col span={4}>Fortnox voucher: {record.fortnox_voucher}</Col>
											)}
										</Row>
									</Col>
								</Row>
							);
						},
					}}
					rowKey='id'
					pagination={{
						pageSize: config.itemsPerPage,
						current: currentPage,
						total: data?.count || 0,
						onChange: handlePageChange,
					}}
					scroll={{ x: 1200, y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
