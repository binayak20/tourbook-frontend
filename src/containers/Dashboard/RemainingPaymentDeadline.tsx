import { Typography } from '@/components/atoms';
import { dashboardAPI } from '@/libs/api';
import { RemainingPayment } from '@/libs/api/@types';
import { Card, Col, Empty, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

export const RemainingPaymentDeadline = () => {
	const { t } = useTranslation();
	const [selected, setSelected] = useState('first_payment');

	const { data: remainingPaymentData, isLoading } = useQuery(['remaining-payment', selected], () =>
		dashboardAPI.remainingPayment(selected)
	);

	const options = useMemo(() => {
		return [
			{ label: t('First payment'), value: 'first_payment' },
			{ label: t('Residue payment'), value: 'residue_payment' },
		];
	}, [t]);
	const columns: ColumnsType<RemainingPayment> = [
		{
			title: t('Booking no.'),
			dataIndex: 'booking_reference',
			ellipsis: true,
		},
		{
			title: t('Passenger name'),
			dataIndex: 'booking_name',
			ellipsis: true,
		},
		{
			title: t('Email'),
			dataIndex: 'email',
			ellipsis: true,
		},
		{
			title: t('Order value'),
			dataIndex: 'grand_total',
			ellipsis: true,
		},
		{
			title: t('Paid'),
			dataIndex: 'total_payment',
			ellipsis: true,
		},
		{
			title: t('Not paid'),
			dataIndex: 'not_paid',
			ellipsis: true,
		},
		{
			title: t('Pending'),
			dataIndex: 'pending_amount',
			ellipsis: true,
		},
		{
			title: t('Deadline'),
			dataIndex: 'deadline',
			ellipsis: true,
		},
	];

	return (
		<Card style={{ borderRadius: 10 }}>
			<Row gutter={12} justify='space-between' style={{ marginBottom: 30 }}>
				<Col>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t('Remaining payments')}
					</Typography.Title>
				</Col>
				<Col>
					<Select
						style={{ width: '160px' }}
						options={options}
						value={selected}
						onChange={(value) => setSelected(value)}
					/>
				</Col>
			</Row>
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
					dataSource={remainingPaymentData}
					columns={columns}
					rowKey='booking_reference'
					scroll={{ y: 250 }}
					loading={isLoading}
					pagination={false}
				/>
			</div>
		</Card>
	);
};
