import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI, transactionsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { getColorForStatus, readableText } from '@/utils/helpers';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Badge, Button, Col, message, Modal, Row, Space, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

export const Transactions = () => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery(
		['bookingTransactions'],
		() => transactionsAPI.list({ ...DEFAULT_LIST_PARAMS, booking: id as unknown as string }),
		{
			enabled: !!id,
		}
	);

	const { mutate: mutateDeleteTransaction, isLoading: isTransactionLoading } = useMutation(
		(transactionID: number) => bookingsAPI.deleteTransaction(id, transactionID),
		{
			onSuccess: (data) => {
				queryClient.invalidateQueries(['booking']);
				queryClient.invalidateQueries(['bookingTransactions']);
				message.success(data.detail);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const columns: ColumnsType<API.Transactions> = [
		{
			title: t('Date'),
			dataIndex: 'created_at',
			render: (created_at, record) => {
				const isManualPayment = record.payment_method.name === 'Manual Payment';
				const isRefundPayment = record.payment_method.name === 'Refund Payment';

				const confirm = () => {
					Modal.confirm({
						centered: true,
						title: t('Are you sure?'),
						icon: <ExclamationCircleOutlined />,
						content: t('Do you want to delete this transaction? This action cannot be undone.'),
						okText: t('Yes'),
						cancelText: t('Not now'),
						onOk: () => mutateDeleteTransaction(record.id),
					});
				};

				return (
					<Space>
						{moment(created_at).format(config.dateTimeFormatReadable)}
						{(isManualPayment || isRefundPayment) && (
							<Button
								danger
								type='link'
								style={{ width: 'auto', height: 'auto' }}
								icon={<DeleteOutlined />}
								disabled={isTransactionLoading}
								onClick={confirm}
							/>
						)}
					</Space>
				);
			},
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
			render: (amount, record) => {
				const isRefundPayment = record.payment_method.name === 'Refund Payment';

				return (
					<Typography.Text
						{...(isRefundPayment && { type: 'danger' })}
					>{`${amount} ${record.currency.currency_code}`}</Typography.Text>
				);
			},
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
