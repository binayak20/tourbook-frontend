import { Button } from '@/components/atoms';
import { Ticket, TicketCreate } from '@/libs/api/@types';
import { ticketsAPI } from '@/libs/api/ticketsAPI';
import { Col, DatePicker, Form, Input, InputNumber, Row, Select, message } from 'antd';
import { omit } from 'lodash';
import moment from 'moment';
import { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { useTicketOptions } from './hooks/useTickeOptions';

const { RangePicker } = DatePicker;

const Divider = styled.div`
	padding: 0.75rem;
	border-radius: 0.25rem;
	margin-bottom: 0.75rem;
	font-size: 1.1rem;
	background-color: var(--ant-primary-1);
	color: var(--ant-primary-color);
	width: 100%;
`;

export const CreateTicket: FC<{ selected?: Ticket; closeModal?: () => void }> = ({
	selected,
	closeModal,
}) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();
	const {
		stationsOptions,
		ticketSuppliersOptions,
		ticketTypesOptions,
		fetchingStations,
		fetchingTicketSuppliers,
		fetchingTicketTypes,
	} = useTicketOptions();

	const { mutate: createTicket } = useMutation(
		(data: API.TicketCreate) =>
			selected ? ticketsAPI.update(selected?.id, data) : ticketsAPI.create(data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['tickets']);
				message.success(
					selected ? t('Ticket has been updated!') : t('New ticket has been created!')
				);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
			onSettled: closeModal,
		}
	);

	const handleSubmit = useCallback(
		(
			data: Omit<TicketCreate, 'start_date' | 'end_date' | 'deadline'> & {
				date_range: moment.Moment[];
				deadline: moment.Moment;
			}
		) => {
			const payload = {
				...omit(data, 'date_range'),
				start_date: data.date_range[0].format('YYYY-MM-DD'),
				end_date: data.date_range[1].format('YYYY-MM-DD'),
				deadline: data.deadline.format('YYYY-MM-DD'),
			};
			createTicket(payload);
		},
		[createTicket]
	);

	useEffect(() => {
		form.setFieldsValue({
			...selected,
			date_range:
				selected?.start_date && selected?.end_date
					? [moment(selected?.start_date), moment(selected?.end_date)]
					: [],
			deadline: selected?.deadline ? moment(selected?.deadline) : null,
			ticket_type: selected?.ticket_type?.id,
			departure_station: selected?.departure_station?.id,
			destination_station: selected?.destination_station?.id,
			ticket_supplier: selected?.ticket_supplier?.id,
		});
	}, [selected, form]);

	return (
		<Form form={form} onFinish={handleSubmit}>
			<Row gutter={[16, 0]}>
				<Col span={4}>
					<Form.Item
						label={t('Type')}
						name='ticket_type'
						labelCol={{ span: 24 }}
						rules={[{ required: true, message: t('Ticket type is required!') }]}
					>
						<Select options={ticketTypesOptions} loading={fetchingTicketTypes} />
					</Form.Item>
				</Col>
				<Col span={10}>
					<Form.Item
						labelCol={{ span: 24 }}
						name='pnr'
						label={t('PNR No.')}
						rules={[{ required: true, message: t('PNR is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={10}>
					<Form.Item
						labelCol={{ span: 24 }}
						name='date_range'
						label={t('Date range')}
						rules={[{ required: true, message: t('Date range is required!') }]}
					>
						<RangePicker style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						label={t('Departure')}
						name='departure_station'
						labelCol={{ span: 24 }}
						rules={[{ required: true, message: t('Departure is required!') }]}
					>
						<Select options={stationsOptions} loading={fetchingStations} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						label={t('Destination')}
						name='destination_station'
						labelCol={{ span: 24 }}
						rules={[{ required: true, message: t('Destination is required!') }]}
					>
						<Select options={stationsOptions} loading={fetchingStations} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						label={t('Supplier')}
						name='ticket_supplier'
						labelCol={{ span: 24 }}
						rules={[{ required: true, message: t('Supplier is required!') }]}
					>
						<Select options={ticketSuppliersOptions} loading={fetchingTicketSuppliers} />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						labelCol={{ span: 24 }}
						name='number_of_tickets'
						label={t('Number of tickets')}
						rules={[{ required: true, message: t('Number of tickets is required') }]}
					>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						labelCol={{ span: 24 }}
						name='deadline'
						label={t('Deadline')}
						rules={[{ required: true, message: t('Deadline is required') }]}
					>
						<DatePicker style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Divider>{t('Outbound')}</Divider>
				<Col span={8}>
					<Form.Item
						labelCol={{ span: 24 }}
						name='outbound_departure_time'
						label={t('Departure time')}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item labelCol={{ span: 24 }} name='outbound_arrival_time' label={t('Arrival time')}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item labelCol={{ span: 24 }} name='outbound_flight_no' label={t('Flight No.')}>
						<Input />
					</Form.Item>
				</Col>
				<Divider>{t('Inbound')}</Divider>
				<Col span={8}>
					<Form.Item
						labelCol={{ span: 24 }}
						name='inbound_departure_time'
						label={t('Departure time')}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item labelCol={{ span: 24 }} name='inbound_arrival_time' label={t('Arrival time')}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item labelCol={{ span: 24 }} name='inbound_flight_no' label={t('Flight No.')}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item labelCol={{ span: 24 }} name='note' label={t('Note to passenger')}>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Row justify='center' gutter={[16, 8]}>
						<Col>
							<Button type='primary' htmlType='submit' size='large'>
								{selected ? t('Update') : t('Create')}
							</Button>
						</Col>
						<Col>
							<Button size='large' onClick={closeModal}>
								{t('Cancel')}
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Form>
	);
};
