import { bookingsAPI } from '@/libs/api';
import { AssignedTicket } from '@/libs/api/@types';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
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
					<div className='group'>
						<div className='label parent'>{t('Outbound')}</div>
						<div className='label child cl1'>{t('Date')}</div>
						<div className='value cv1'>{item.ticket.start_date}</div>
						<div className='label child cl2'>{t('Time')}</div>
						<div className='value cv2'>{item.ticket.outbound_departure_time}</div>
						<div className='label child cl3'>{t('Location')}</div>
						<div className='value cv3'>{item.ticket.departure_station?.name}</div>
						<div className='label child cl4'>{t('Flight')}</div>
						<div className='value cv4'>{item.ticket.outbound_flight_no}</div>
					</div>
					<div className='group'>
						<div className='label parent'>{t('Inbound')}</div>
						<div className='label child cl1'>{t('Date')}</div>
						<div className='value cv1'>{item.ticket.end_date}</div>
						<div className='label child cl2'>{t('Time')}</div>
						<div className='value cv2'>{item.ticket.inbound_departure_time}</div>
						<div className='label child cl3'>{t('Location')}</div>
						<div className='value cv3'>{item.ticket.destination_station?.name}</div>
						<div className='label child cl4'>{t('Flight')}</div>
						<div className='value cv4'>{item.ticket.inbound_flight_no}</div>
					</div>
					<div className='solo text-center'>
						<div className='label'>{t('Supplier')}</div>
						<div className='value'>{item.ticket.ticket_supplier?.name}</div>
					</div>
					<div className='close'>
						<Popconfirm
							title={t('Are you sure you want to unassign this ticket?')}
							onConfirm={() => unassignTicket(item.assigned_id)}
							disabled={!isAllowedTo('DELETE_ASSIGNTICKET')}
						>
							<Button
								icon={<DeleteOutlined />}
								size='small'
								danger
								disabled={!isAllowedTo('DELETE_ASSIGNTICKET')}
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
	grid-template-columns: auto auto auto auto;
	.label {
		opacity: 0.65;
		padding: 0.25rem 0;
		&.cl1 {
			grid-area: cl1;
		}
		&.cl2 {
			grid-area: cl2;
		}
		&.cl3 {
			grid-area: cl3;
		}
		&.cl4 {
			grid-area: cl4;
		}
	}
	.value {
		color: var(--ant-primary-color);
		font-weight: 600;
		padding: 0.25rem 0;
		&.cv1 {
			grid-area: cv1;
		}
		&.cv2 {
			grid-area: cv2;
		}
		&.cv3 {
			grid-area: cv3;
		}
		&.cv4 {
			grid-area: cv4;
		}
	}
	.solo {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.group {
		display: grid;
		grid-template-areas:
			'p p p p'
			'cl1 cl2 cl3 cl4'
			'cv1 cv2 cv3 cv4';
		grid-template-columns: repeat(4, auto);
		grid-template-rows: 1fr 1fr 1fr;
	}
	.parent {
		grid-area: p;
		width: 100%;
		text-align: center;
	}
	.child {
		border-top: 1px dashed rgba(0, 0, 0, 0.4);
		border-bottom: 1px dashed rgba(0, 0, 0, 0.4);
	}
	.text-center {
		text-align: center;
	}
	.close {
		position: absolute;
		right: 0.25rem;
		top: 0.25rem;
	}
`;

export default TicketStrip;
