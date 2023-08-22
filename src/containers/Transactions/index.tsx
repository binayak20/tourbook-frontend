import { Typography } from '@/components/atoms';
import config from '@/config';
import { transactionsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { getColorForStatus, getPaginatedParams } from '@/utils/helpers';
import { Badge, Col, Empty, Row, Table } from 'antd';
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
	const { current, pageSize } = useMemo(() => {
		return {
			current: parseInt(searchParams.get('page') || '1'),
			pageSize: parseInt(searchParams.get('limit') || `${config.itemsPerPage}`),
		};
	}, [searchParams]);

	const params: API.TransactionsParams = useMemo(() => {
		return {
			page: current,
			limit: pageSize,
			name: searchParams.get('name') || undefined,
			payment_status: searchParams.get('status') || undefined,
			payment_method: searchParams.get('payment_method') || undefined,
			booking_reference: searchParams.get('booking_reference') || undefined,
		};
	}, [current, searchParams, pageSize]);

	const { data, isLoading } = useQuery(['transactions', params], () =>
		transactionsAPI.list(params)
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
			render: (amount, record) => `${amount} ${record.currency.currency_code}`,
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
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Transactions')} ({data?.count || 0})
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
											Order ID :{' '}
										</Typography.Title>{' '}
										{record.order_id}
									</Col>
									<Col span={12}>
										<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
											{' '}
											{t('Tour')} :{' '}
										</Typography.Title>{' '}
										{record.tour.name}
									</Col>
									<Col span={12}>
										<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
											{t(`First name`)} :
										</Typography.Title>
										{record.first_name ?? record.payment_address?.family_name}
									</Col>
									<Col span={12}>
										<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
											{t(`Last name`)} :
										</Typography.Title>
										{record.last_name ?? record.payment_address?.given_name}
									</Col>
									{record?.email ||
										(record?.payment_address?.email && (
											<Col span={12}>
												<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
													{t(`Email`)} :
												</Typography.Title>
												{record.email ?? record?.payment_address?.email}
											</Col>
										))}
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
					scroll={{ x: 1200, y: '100%' }}
					loading={isLoading}
				/>
			</div>
		</div>
	);
};
