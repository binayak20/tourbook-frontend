import { Typography } from '@/components/atoms';
import { OutlinedRangePicker, OutlinedSelect } from '@/components/atoms/FormItems';
import { Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { data } from './dummy';

export type DataType = {
	id: number;
	booking_id: number;
	passenger: string;
	reference: string;
	created_at: string;
	amount: number;
	currency: string;
	payment_type: string;
	tour: {
		id: number;
		name: string;
		departure_datetime: string;
	};
	status: string;
	transaction_id: string;
	shipping_address?: {
		given_name?: string;
		family_name?: string;
		email?: string;
		street_address?: string;
		postal_code?: string;
		city?: string;
		phone?: string | null;
		country?: string;
	};
	is_sent_to_fortnox: boolean;
	fortnox_voucher: string;
	booking_status: string;
};

const dataSource: DataType[] = data;

const { Option } = OutlinedSelect;

export const Transactions = () => {
	const { t } = useTranslation();
	const columns: ColumnsType<DataType> = [
		{
			title: t('Passenger'),
			dataIndex: 'passenger',
			render: (text) => text,
			width: '16rem',
		},
		{
			title: t('Reference'),
			dataIndex: 'reference',
			width: '12rem',
		},
		{
			title: t('Time'),
			dataIndex: 'created_at',
			render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
			width: '16rem',
		},
		{
			title: t('Status'),
			dataIndex: 'status',
			width: '10rem',
		},

		{
			title: t('Tour'),
			dataIndex: 'tour',
			render: (text) => text?.name,
			ellipsis: true,
		},

		{
			title: t('Amount'),
			dataIndex: 'amount',
			align: 'right',
			width: '10rem',
			render: (text) => text?.toLocaleString('sv-SE'),
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<Row align='middle'>
					<Col flex={1}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Transactions')}
						</Typography.Title>
					</Col>
					<Row>
						<Col>
							<OutlinedRangePicker
								onChange={(value) => console.log(value ? value[0]?.format('YYYY-MM-DD') : '')}
							/>
						</Col>
						<Col>
							<OutlinedSelect placeholder='Test'>
								<Option>Option 1</Option>
								<Option>Option 2</Option>
							</OutlinedSelect>
						</Col>
					</Row>
				</Row>
			</div>
			<div
				style={{
					maxWidth: '100%',
					minHeight: '1px',
				}}
			>
				<Table
					dataSource={dataSource}
					columns={columns}
					rowKey='id'
					pagination={false}
					scroll={{ y: '100%' }}
				/>
			</div>
			<div>
				<Pagination />
			</div>
		</div>
	);
};
