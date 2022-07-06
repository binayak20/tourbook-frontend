import { ReactComponent as ElipsisIcon } from '@/assets/images/icons/elipsis.svg';
import { Button, Typography } from '@/components/atoms';
import { OutlinedRangePicker, OutlinedSelect } from '@/components/atoms/FormItems';
import { Col, Pagination, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { useTranslation } from 'react-i18next';
import { ticketsData } from './dummy';

export type DataType = {
	id: number;
	start_date: string;
	end_date: string;
	assigned_tickets: number;
	week_number: null | number;
	number_of_tickets: number;
	transportation_type: number;
	transportation_type_name: string;
	departure: number;
	departure_station_name: string;
	destination: number;
	destination_station_name: string;
	pnr: string;
	transportation_company: number;
	transportation_company_name: string;
	available_tickets: number;
	note: null | string;
};

const dataSource: DataType[] = ticketsData;

const { Option } = OutlinedSelect;

export const Tickets = () => {
	const { t } = useTranslation();
	const columns: ColumnsType<DataType> = [
		{
			title: t('Date Range'),
			dataIndex: 'start_date',
			render: (value, record) => `${record.start_date} to ${record.end_date}`,
		},
		{
			title: t('Departure'),
			dataIndex: 'departure_station_name',
		},
		{
			title: t('PNR No'),
			dataIndex: 'pnr',
		},
		{
			title: t('Ticket Type'),
			dataIndex: 'transportation_type_name',
		},
		{
			title: t('Ticket Supplier'),
			dataIndex: 'transportation_company_name',
		},
		{
			title: t('Total Tickets'),
			dataIndex: 'number_of_tickets',
		},
		{
			title: t('Available Tickets'),
			dataIndex: 'available_tickets',
		},
		{
			title: t('Assigned Tickets'),
			dataIndex: 'assigned_tickets',
		},
		{
			title: t('Note'),
			dataIndex: 'note',
		},
		{
			title: t('Actions'),
			render: () => (
				<Button
					style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
					icon={<ElipsisIcon />}
				/>
			),
		},
	];

	return (
		<div style={{ display: 'flex', height: '100%', flexDirection: 'column', gap: '1rem' }}>
			<div>
				<Row align='middle'>
					<Col flex={1}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Ticket Locations')}
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
