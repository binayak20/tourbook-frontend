import { bookingsAPI } from '@/libs/api';
import { AssignedTicket } from '@/libs/api/@types';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import moment from 'moment';
import { FC } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

const TicketStrip: FC<{
	data?: (AssignedTicket['booking_ticket'] & { assigned_id: number })[];
}> = ({ data }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { isAllowedTo } = useAccessContext();
	const { mutate: unassignTicket } = useMutation((id: number) => bookingsAPI.unassignTicket(id), {
		onSuccess: () => {
			message.success(t('Ticket has been unassigned!'));
			queryClient.invalidateQueries(['assigned-tickets']);
			queryClient.invalidateQueries(['booking-tickets']);
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});
	return (
		<>
			{data?.map((item) => (
				<Strip key={item.id}>
					<div className='solo'>
						<div className='label'>{t('PNR')}</div>
						<div className='value'>{item.ticket.pnr}</div>
					</div>
					<div className='mid-section'>
						<div className='ticket'>
							<div>{moment(item.ticket.ticket_outbound_date).format('DD MMM YYYY')}</div>
							<div>{item.ticket.outbound_flight_no}</div>
							<div>
								{item.ticket.departure_station?.name} - {item.ticket.destination_station?.name}
							</div>
							<div>
								{item.ticket.outbound_departure_time} - {item.ticket.outbound_arrival_time}
							</div>
						</div>
						<div className='ticket'>
							<div>{moment(item.ticket.ticket_inbound_date).format('DD MMM YYYY')}</div>
							<div>{item.ticket.inbound_flight_no}</div>
							<div>
								{item.ticket.destination_station?.name} - {item.ticket.departure_station?.name}
							</div>
							<div>
								{item.ticket.inbound_departure_time} - {item.ticket.inbound_arrival_time}
							</div>
						</div>
					</div>

					<div className='solo text-center'>
						<div className='label'>{t('Supplier')}</div>
						<div className='value'>{item.ticket.ticket_supplier?.name}</div>
					</div>
					<div className='close'>
						<Popconfirm
							title={t('Are you sure you want to unassign this ticket?')}
							onConfirm={() => unassignTicket(item.assigned_id)}
							disabled={!isAllowedTo('DELETE_ASSIGNEDTICKET')}
						>
							<Button
								icon={<DeleteOutlined />}
								size='small'
								danger
								disabled={!isAllowedTo('DELETE_ASSIGNEDTICKET')}
							/>
						</Popconfirm>
					</div>
				</Strip>
			))}
		</>
	);
};

const Strip = styled.div`
	display: grid;
	position: relative;
	gap: 1.5rem;
	border-radius: 0.15rem;
	padding: 0.75rem;
	margin-bottom: 0.75rem;
	border: 1px dashed var(--ant-primary-4);
	grid-template-columns: 1fr auto 1fr;
	.value {
		color: var(--ant-primary-color);
		font-weight: 600;
		padding: 0.25rem 0;
	}
	.label {
		opacity: 0.65;
		padding: 0.25rem 0;
	}

	.solo {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.text-center {
		text-align: center;
	}
	.close {
		position: absolute;
		right: 0.25rem;
		top: 0.25rem;
	}
	.mid-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.5rem;
		margin-left: -3rem;
		.ticket {
			display: flex;
			gap: 1.5rem;
			color: var(--ant-primary-color);
			font-weight: 500;
		}
	}
`;

export default TicketStrip;
