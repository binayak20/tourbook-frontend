import { Typography } from '@/components/atoms';
import { useBookingContext } from '@/components/providers/BookingProvider';
import config from '@/config';
import { bookingsAPI, transactionsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS, TRANSACTION_TYPES } from '@/utils/constants';
import { convertToCurrency, getColorForStatus } from '@/utils/helpers';
import {
	DeleteOutlined,
	DownloadOutlined,
	ExclamationCircleOutlined,
	MailOutlined,
} from '@ant-design/icons';
import {
	Badge,
	Button,
	Col,
	Empty,
	Modal,
	Popconfirm,
	Row,
	Space,
	Table,
	Tooltip,
	message,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

export const Transactions = () => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const [currentid, setCurrentId] = useState<number | null>(null);
	const queryClient = useQueryClient();
	const {
		bookingInfo: { reference, total_payment },
	} = useBookingContext();

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
	const { mutate: mutateSendInvoice, isLoading: isSendInvoiceLoading } = useMutation(
		(transactionID: number) => bookingsAPI.sendInvoiceToCustomer(id, transactionID),
		{
			onSuccess: (data) => {
				//queryClient.invalidateQueries(['booking']);
				//queryClient.invalidateQueries(['bookingTransactions']);
				message.success(data.detail);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const downloadPDF = (data: Blob, filename: string) => {
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(data);
		link.download = filename;
		document.body.append(link);
		link.click();
		link.remove();
	};

	const { mutate: mutateDownloadInvoice, isLoading: isInvoiceLoading } = useMutation(
		(transactionID: number) => bookingsAPI.downloadInvoice(id, transactionID),
		{
			onSuccess: (data) => {
				downloadPDF(data, `booking-${reference}.pdf`);
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
				const isManualPayment = record.payment_method.name === TRANSACTION_TYPES.MANUAL_PAYMENT;
				const isInvoicePayment = record.payment_method.name === TRANSACTION_TYPES.INVOICE_PAYMENT;
				const isRefundPayment = record.payment_method.name === TRANSACTION_TYPES.REFUND_PAYMENT;

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
						{dayjs(created_at).format(config.dateTimeFormatReadable)}
						{isInvoicePayment && (
							<Tooltip placement='top' title={t('Download invoice')}>
								<Button
									type='link'
									style={{ width: 'auto', height: 'auto' }}
									icon={<DownloadOutlined />}
									disabled={isInvoiceLoading && currentid == record.id}
									onClick={() => {
										setCurrentId(record.id);
										mutateDownloadInvoice(record.id);
									}}
								/>
							</Tooltip>
						)}
						{(isManualPayment || isRefundPayment) && (
							<Tooltip placement='top' title={t('Delete transaction')}>
								<Button
									danger
									type='link'
									style={{ width: 'auto', height: 'auto' }}
									icon={<DeleteOutlined />}
									disabled={isTransactionLoading && currentid == record.id}
									onClick={() => {
										setCurrentId(record.id);
										confirm();
									}}
								/>
							</Tooltip>
						)}
						{isInvoicePayment && (
							<Popconfirm
								title={t('Are you sure you want to send invoice to customer ?')}
								onConfirm={() => {
									setCurrentId(record.id);
									mutateSendInvoice(record.id);
								}}
								okText='Yes'
								cancelText='No'
							>
								<Tooltip placement='top' title={t('Send invoice to customer')}>
									<Button
										danger
										type='link'
										style={{ width: 'auto', height: 'auto' }}
										icon={<MailOutlined />}
										disabled={isSendInvoiceLoading && currentid == record.id}
									/>
								</Tooltip>
							</Popconfirm>
						)}
					</Space>
				);
			},
		},
		{
			align: 'center',
			title: t('Status'),
			dataIndex: 'status',
			width: 180,
			render: (status) => {
				return (
					<Badge
						style={{
							fontSize: 14,
							textTransform: 'capitalize',
							backgroundColor: getColorForStatus(status),
						}}
						count={status}
					/>
				);
			},
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
					<>
						<Typography.Text {...(isRefundPayment && { type: 'danger' })}>{`
						${convertToCurrency(amount, record?.currency?.currency_code)}
						`}</Typography.Text>
					</>
				);
			},
		},
		{
			align: 'right',
			title: t('Paid'),
			dataIndex: 'amount',
			render: (amount, record) => {
				const isRefundPayment = record.payment_method.name === 'Refund Payment';

				return (
					<>
						<Typography.Text {...(isRefundPayment && { type: 'danger' })}>{`
						${convertToCurrency(
							isRefundPayment ? amount : amount - record?.pending_amount,
							record?.currency?.currency_code
						)}
						`}</Typography.Text>
					</>
				);
			},
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
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
					tableLayout='fixed'
					expandable={{
						expandedRowRender: (record) => {
							return (
								<Row>
									<Col span={12}>
										<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
											{`${t(`Tour`)}: `}
										</Typography.Title>
										{record.tour.name}
									</Col>
									<Col span={12}>
										<Typography.Title level={5} type='primary' style={{ display: 'inline' }}>
											{`${t(`Order ID`)}: `}
										</Typography.Title>
										{record.order_id}
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
									{`${t('Total')}: `} {total_payment}
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
