import { Typography } from '@/components/atoms';
import config from '@/config';
import { transactionsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { getColorForStatus, readableText } from '@/utils/helpers';
import { Badge, Col, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

export const Transactions = () => {
	const { t } = useTranslation();
	const { id } = useParams();

	const { data, isLoading } = useQuery(
		['bookingTransactions'],
		() => transactionsAPI.list({ ...DEFAULT_LIST_PARAMS, booking: id }),
		{
			enabled: !!id,
		}
	);

	const columns: ColumnsType<API.Transactions> = [
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
			align: 'center',
			title: t('Paid by'),
			dataIndex: 'payment_method',
			render: (payment_method) => <Typography.Text>{payment_method.name}</Typography.Text>,
		},
		{
			align: 'right',
			title: t('Amount'),
			dataIndex: 'amount',
			render: (amount, record) => `${amount} ${record.currency.currency_code}`,
		},
	];

	const totalAmount = useMemo(() => {
		const total =
			data?.results.reduce((acc, cur) => {
				let amount = 0;
				if (cur.status === 'success') {
					amount += cur.amount;
				}
				return acc + amount;
			}, 0) || 0;
		const currency = data?.results[0]?.currency.currency_code || '';
		return `${parseFloat(total.toString()).toFixed(2)} ${currency}`;
	}, [data]);

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Transactions')}
					</Typography.Title>
				</Col>
			</Row>

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
														<Col span={12} key={key}>
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
					pagination={false}
					loading={isLoading}
					footer={() => (
						<Row justify='end'>
							<Col>
								<Typography.Title level={5} type='primary' className='margin-0'>
									{t('Total')}: {totalAmount}
								</Typography.Title>
							</Col>
						</Row>
					)}
					style={{ height: 'inherit' }}
				/>
			</div>
		</div>
	);
};
