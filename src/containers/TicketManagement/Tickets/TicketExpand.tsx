import { Ticket } from '@/libs/api/@types';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Table as AntTable } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Table = styled(AntTable)`
	.ant-table-thead {
		.ant-table-cell {
			font-size: 0.8rem;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.65);
		}
	}
` as typeof AntTable;

const TicketExpand: FC<{ data: Ticket }> = ({ data }) => {
	const { t } = useTranslation();
	const columns: ColumnsType<Ticket> = [
		{
			title: t('Ticket type'),
			dataIndex: 'ticket_type',
			width: 80,
			render: (value) => value?.name,
		},
		{
			title: (
				<>
					{t('Inbound Flight No')}
					<br />
					{t('Dep. time - Arr. time')}
				</>
			),
			dataIndex: 'inbound_flight_no',
			render: (value, record) => (
				<>
					<div>{value}</div>
					<div>{`${record.inbound_departure_time} - ${record.inbound_arrival_time}`}</div>
				</>
			),
		},
		{
			title: (
				<>
					{t('Outbound Flight No')}
					<br />
					{t('Dep. time - Arr. time')}
				</>
			),
			dataIndex: 'outbound_flight_no',
			render: (value, record) => (
				<>
					<div>{value}</div>
					<div>{`${record.outbound_departure_time} - ${record.outbound_arrival_time}`}</div>
				</>
			),
		},

		{
			title: t('Assigned'),
			dataIndex: 'number_of_allocated_tickets',
			render: (value, record) =>
				record.number_of_allocated_tickets > 0 ? (
					<Link
						to={`/dashboard/${PRIVATE_ROUTES.TICKET_MANAGEMENT}/${PRIVATE_ROUTES.TICKETS}/${record.id}/passengers/`}
					>
						{record.number_of_allocated_tickets}
					</Link>
				) : (
					record.number_of_allocated_tickets
				),
		},
		{
			title: t('Note'),
			dataIndex: 'note',
			width: 200,
		},
		{
			title: (
				<>
					{t('Reminder days')}
					<br />
					{t('Email')}
				</>
			),
			dataIndex: 'reminder_days',
			render: (value, record) => (
				<>
					<div>{value ?? '-'}</div>
					<div>{record?.reminder_email ?? '-'}</div>
				</>
			),
		},
		{
			title: t('Reminder note'),
			dataIndex: 'reminder_note',
		},
		{
			title: t('Deadline'),
			dataIndex: 'deadline',
		},
	];

	return (
		<Table size='small' columns={columns} dataSource={[data]} pagination={false} rowKey='id' />
	);
};

export default TicketExpand;
