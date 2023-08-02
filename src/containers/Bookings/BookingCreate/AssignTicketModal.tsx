import { Checkbox } from '@/components/atoms';
import { bookingsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Button, Col, message, Modal, ModalProps, Row, Select } from 'antd';
import { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

const AssignTicketModal: FC<ModalProps & { passengerId: number | null; onClose: () => void }> = ({
	passengerId,
	onClose,
	...rest
}) => {
	const { id } = useParams();
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
	const [groupAssign, setGroupAssign] = useState(false);
	const { data: tickets, isLoading: isFetchingTickets } = useQuery(['booking-tickets', id], () =>
		bookingsAPI.tickets(id as string, DEFAULT_LIST_PARAMS)
	);
	const { mutate: assignTicket, isLoading: isAssigningTicket } = useMutation(
		(payload: { booking_ticket: number; passenger: number }) =>
			groupAssign
				? bookingsAPI.groupAssignTicket(id as string, { booking_ticket: payload?.booking_ticket })
				: bookingsAPI.assignTicket(payload),
		{
			onSuccess: () => {
				message.success(t('Ticket has been assigned!'));
				queryClient.invalidateQueries(['assigned-tickets']);
				queryClient.invalidateQueries(['booking-tickets']);
				onClose?.();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleAssignTicket = useCallback(() => {
		if (selectedTicket) {
			assignTicket({ booking_ticket: selectedTicket, passenger: passengerId as number });
		}
	}, [assignTicket, passengerId, selectedTicket]);
	const ticketOptions = tickets?.results?.map(
		({ number_of_tickets, number_of_assigned_tickets, ticket, id }) => ({
			label: (
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<span>{`${ticket.ticket_supplier?.name} - ${ticket.pnr} - ${ticket.departure_station?.name} ${ticket.destination_station?.name}`}</span>
					<span style={{ opacity: '0.65' }}>{`${t('Available')}: ${
						number_of_tickets - number_of_assigned_tickets
					}/${number_of_tickets}`}</span>
				</div>
			),
			value: id,
		})
	);
	return (
		<Modal {...rest} footer={false}>
			<Row justify='center' gutter={[8, 24]}>
				<Col span={24}>
					<Select
						options={ticketOptions}
						style={{ width: '100%' }}
						value={selectedTicket}
						onChange={setSelectedTicket}
						placeholder={t('Please select a ticket')}
						loading={isFetchingTickets}
					/>
				</Col>
				<Col span={24}>
					<Checkbox checked={groupAssign} onChange={(e) => setGroupAssign(e.target.checked)}>
						{t('Assign to all passengers')}
					</Checkbox>
				</Col>
				<Col span={4}>
					<Button block type='primary' onClick={handleAssignTicket} loading={isAssigningTicket}>
						{t('Assign')}
					</Button>
				</Col>
			</Row>
		</Modal>
	);
};

export default AssignTicketModal;
