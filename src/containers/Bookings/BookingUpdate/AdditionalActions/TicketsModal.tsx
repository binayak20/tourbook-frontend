import { useBookingContext } from '@/components/providers/BookingProvider';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { AllocateTicketPayload, Ticket } from '@/libs/api/@types';
import { ticketsAPI } from '@/libs/api/ticketsAPI';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
	Button,
	Col,
	DatePicker,
	Input,
	InputNumber,
	message,
	Modal,
	ModalProps,
	Popconfirm,
	Row,
	Select,
	Space,
	Table,
	Tooltip,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { debounce, omit } from 'lodash';
import moment from 'moment';
import { ChangeEvent, FC, useCallback, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

const { RangePicker } = DatePicker;

const TicketsModal: FC<ModalProps> = ({ ...rest }) => {
	const { id } = useParams();
	const { t } = useTranslation();
	const [pnr, setPnr] = useState('');
	const queryClient = useQueryClient();
	const { isAllowedTo } = useAccessContext();
	const [quantity, setQuantity] = useState<number | null>(1);
	const [editQuantity, setEditQuantity] = useState<{
		[key: string]: number | null;
	}>({});
	const {
		bookingInfo: { departure_date, return_date },
	} = useBookingContext();
	const [selectedTicket, setSelectedTicket] = useState<number | null>();
	const [dateRange, setDateRange] = useState<
		[moment.Moment, moment.Moment] | [undefined, undefined]
	>(
		departure_date && return_date
			? [moment(departure_date), moment(return_date)]
			: [undefined, undefined]
	);

	const handlePnrChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
		setPnr(e.target.value);
		setSelectedTicket(undefined);
	}, 250);

	const { isLoading: fetchingTickets, data: tickets } = useQuery(['tickets', pnr, dateRange], () =>
		ticketsAPI.list({
			...DEFAULT_LIST_PARAMS,
			pnr,
			ticket_outbound_date: dateRange?.[0]?.format(config.dateFormat),
			ticket_inbound_date: dateRange?.[1]?.format(config.dateFormat),
		})
	);

	const { data: bookingTickets, isLoading: fetchingBookingTickets } = useQuery(
		['booking-tickets', id],
		() => bookingsAPI.tickets(id as string, DEFAULT_LIST_PARAMS)
	);

	const bookingTicketsList = bookingTickets?.results?.map((item) => ({
		...item.ticket,
		booking_ticket_id: item.id,
		number_of_booking_tickets: item.number_of_tickets,
		number_of_assigned_tickets: item.number_of_assigned_tickets,
	}));

	const { mutate: allocateTicket } = useMutation(
		(data: AllocateTicketPayload & { booking_ticket_id?: number }) =>
			data?.booking_ticket_id
				? bookingsAPI.updateAllocateTicket(data?.booking_ticket_id, omit(data, 'booking_ticket_id'))
				: bookingsAPI.allocateTicket(data),
		{
			onSuccess: (_, data) => {
				message.success(
					data?.booking_ticket_id ? t('Ticket has been updated!') : t('Ticket has been allocated!')
				);
				queryClient.invalidateQueries('tickets');
				queryClient.invalidateQueries('booking-tickets');
				setSelectedTicket(undefined);
				setQuantity(1);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: deleteBookingTicket } = useMutation(
		(id: number) => bookingsAPI.deleteAllocateTicket(id),
		{
			onSuccess: () => {
				message.success(t('Ticket has been removed!'));
				queryClient.invalidateQueries('booking-tickets');
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleTicketAllocate = useCallback(() => {
		if (selectedTicket && !!quantity)
			allocateTicket({
				booking: Number(id),
				ticket: selectedTicket,
				number_of_tickets: quantity,
			});
	}, [id, selectedTicket, quantity, allocateTicket]);

	const handleTicketAllocateUpdate = useCallback(
		(bookingTicketId: number, ticketId: number) => {
			allocateTicket({
				booking: Number(id),
				ticket: ticketId,
				number_of_tickets: editQuantity[bookingTicketId] as number,
				booking_ticket_id: bookingTicketId,
			});
		},
		[id, allocateTicket, editQuantity]
	);

	const ticketOptions = tickets?.results?.map((ticket) => ({
		label: (
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>{`${ticket.ticket_supplier?.name} - ${ticket.pnr} - ${ticket.departure_station?.name} ${ticket.destination_station?.name}`}</span>
				<span style={{ opacity: '0.65' }}>{`${t('Available')}: ${ticket?.available_tickets}/${
					ticket?.number_of_tickets
				}`}</span>
			</div>
		),
		value: ticket.id,
	}));

	const columns: ColumnsType<
		Ticket & {
			booking_ticket_id: number;
			number_of_booking_tickets: number;
			number_of_assigned_tickets: number;
		}
	> = [
		{
			title: t('PNR'),
			dataIndex: 'pnr',
		},
		{
			title: t('Date Range'),
			dataIndex: 'ticket_outbound_date',
			render: (value, record) => (
				<span
					style={{
						opacity: '0.75',
					}}
				>{`${value} to ${record?.ticket_inbound_date}`}</span>
			),
		},
		{
			title: t('Departure'),
			dataIndex: 'departure_station',
			render: (value) => value?.name,
		},
		{
			title: t('Destination'),
			dataIndex: 'destination_station',
			render: (value) => value?.name,
		},
		{
			title: t('Supplier'),
			dataIndex: 'ticket_supplier',
			render: (value) => value?.name,
		},
		{
			title: t('Quantity'),
			dataIndex: 'number_of_booking_tickets',
			render: (number_of_tickets, record) =>
				editQuantity[record?.booking_ticket_id] ? (
					<InputNumber
						value={editQuantity?.[record?.booking_ticket_id]}
						style={{ width: '72px' }}
						onChange={(value) =>
							setEditQuantity({
								[record?.booking_ticket_id]: value,
							})
						}
					/>
				) : (
					<Tooltip title={t('Remaing / Allocated / Available')}>
						{`${number_of_tickets - record?.number_of_assigned_tickets}/(${number_of_tickets})/${
							record?.number_of_tickets - record?.number_of_allocated_tickets
						}`}
					</Tooltip>
				),
		},
		{
			title: t('Actions'),
			dataIndex: 'booking_ticket_id',
			render: (value, record) => (
				<Space>
					{editQuantity?.[value] ? (
						<Button
							type='primary'
							icon={<CheckOutlined />}
							onClick={() => {
								handleTicketAllocateUpdate(value, record?.id);
								setEditQuantity({});
							}}
						/>
					) : (
						<Button
							onClick={() =>
								setEditQuantity({
									[value]: record?.number_of_booking_tickets,
								})
							}
							icon={<EditOutlined />}
							disabled={!isAllowedTo('CHANGE_BOOKINGTICKET')}
						/>
					)}
					<Popconfirm
						title={t('Are you sure to delete this ticket?')}
						onConfirm={() => deleteBookingTicket(value)}
						okText={t('Yes')}
						cancelText={t('No')}
					>
						<Button danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Modal centered width={1024} footer={false} {...rest} title={t('Booking tickets')}>
			<Row gutter={[16, 16]}>
				<Col>
					<Input onChange={handlePnrChange} placeholder={t('PNR')} size='large' />
				</Col>
				<Col>
					<RangePicker
						size='large'
						disabledDate={(current) => current && current < moment().endOf('day')}
						onChange={(values) => {
							setDateRange(values as [moment.Moment, moment.Moment]);
							setSelectedTicket(undefined);
						}}
						value={dateRange as [moment.Moment, moment.Moment]}
					/>
				</Col>
				<Col span={18}>
					<Select
						size='large'
						value={selectedTicket}
						options={ticketOptions}
						loading={fetchingTickets}
						style={{ width: '100%' }}
						onChange={setSelectedTicket}
						placeholder={tickets?.count ? t('Select ticket') : t('No ticket found')}
					/>
				</Col>
				<Col span={3}>
					<InputNumber
						disabled={!selectedTicket}
						size='large'
						style={{ width: '100%' }}
						placeholder={t('Quantity')}
						value={quantity}
						onChange={setQuantity}
						min={1}
					/>
				</Col>
				<Col span={3}>
					<Button
						size='large'
						type='primary'
						block
						onClick={handleTicketAllocate}
						disabled={!selectedTicket || !isAllowedTo('ADD_BOOKINGTICKET')}
					>
						{t('Allocate')}
					</Button>
				</Col>
				<Col span={24}>
					<Table
						columns={columns}
						pagination={false}
						loading={fetchingBookingTickets}
						dataSource={bookingTicketsList}
					/>
				</Col>
			</Row>
		</Modal>
	);
};

export default TicketsModal;
