import { Button, Switch, Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI, locationsAPI } from '@/libs/api';
import { AssignedTicket } from '@/libs/api/@types';
import { DEFAULT_LIST_PARAMS, DEFAULT_PICKER_VALUE, NAME_INITIALS } from '@/utils/constants';
import {
	ArrowDownOutlined,
	ArrowUpOutlined,
	CheckOutlined,
	DeleteOutlined,
	PlusOutlined,
	SwapOutlined,
	TagOutlined,
} from '@ant-design/icons';
import {
	Alert,
	Card as AntCard,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	Radio,
	Row,
	Select,
} from 'antd';
import moment from 'moment';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import AssignTicketModal from './AssignTicketModal';
import TicketStrip from './TicketStrip';
import { usePassenger } from './hooks';
import { PassengerDetailsProps, PassengerItem } from './types';

const PASSENGER_KEYS = [
	'id',
	'first_name',
	'last_name',
	'email',
	'name_title',
	'gender',
	'date_of_birth',
	'personal_identity_number',
	'passport_number',
	'passport_expiry_date',
	'passport_birth_city',
	'nationality',
	'telephone_number',
	'passenger_type',
	'allergy',
	'allergy_description',
	'additional_info',
	'is_primary_passenger',
	'emergency_contact_name',
	'emergency_contact_telephone_number',
	'emergency_contact_email',
	'emergency_contact_relation',
	'pickup_location',
	'address',
	'city',
	'post_code',
];

export const PassengerDetails: React.FC<PassengerDetailsProps> = ({
	initialValues,
	totalPassengers,
	backBtnProps,
	onFinish,
	disabled,
	loading,
	totalPassengerTransfers,
	tour,
}) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const passengers: PassengerItem[] = Form.useWatch('passengers', form);
	const { id } = useParams() as unknown as { id: number };
	const { isAllowedTo } = useAccessContext();
	const [ticketAssignModal, setTicketAssignModal] = useState<number | null>(null);
	useEffect(() => {
		if (initialValues?.passengers?.length) {
			form.setFieldsValue(initialValues);
		}
	}, [initialValues, form]);

	const { data: pickupLocations, isLoading: isPickupLocationsLoading } = useQuery(
		['tours-pickup-locations'],
		() => locationsAPI.pickupLocationList({ ...DEFAULT_LIST_PARAMS, tour })
	);

	const { data: assignedTickets } = useQuery('assigned-tickets', () =>
		bookingsAPI.assignedTickets(id)
	);

	const asssignedTicketsMap = useMemo(
		() =>
			assignedTickets?.reduce((acc, assignedTicket) => {
				acc[assignedTicket.passenger.id] = [
					...(acc[assignedTicket.passenger.id] || []),
					{
						...assignedTicket.booking_ticket,
						assigned_id: assignedTicket.id,
					},
				];
				return acc;
			}, {} as { [key: string]: (AssignedTicket['booking_ticket'] & { assigned_id: number })[] }),
		[assignedTickets]
	);

	const formPassengerTransferCount = useMemo(() => {
		const passengerWithTransfer = passengers?.filter(
			(passenger) => passenger?.pickup_location !== 'no-transfer' && passenger?.pickup_location
		);
		return passengerWithTransfer?.length;
	}, [passengers]);

	const pickupLocationOptions = useMemo(
		() => [
			...(pickupLocations?.results.map(({ id, name, is_active }) => ({
				label: name,
				value: id,
				disabled: !is_active,
			})) || []),
			{ label: 'No transfer', value: 'no-transfer' },
		],
		[pickupLocations]
	);

	const PassengerAgeGroupOptions = [
		{ label: 'Adult', value: 'adult' },
		{ label: 'Child', value: 'child' },
		{ label: 'Infant', value: 'infant' },
	];

	const {
		mutateGeneratePassword,
		mutatePrimaryPassenger,
		mutateRemovePassenger,
		mutateMovePassenger,
		isGeneratePasswordLoading,
		isPrimaryPassengerLoading,
		isRemovePassengerLoading,
	} = usePassenger();

	const handlePrimaryPassenger = useCallback(
		(index: number) => {
			const values = form.getFieldsValue();
			const passenger = values.passengers[index];

			if (id && passenger.id && !passenger.is_primary_passenger) {
				mutatePrimaryPassenger(passenger.id);
				return;
			}

			passenger.is_primary_passenger = true;
			values.passengers = values.passengers.map((passenger: PassengerItem, i: number) => {
				if (i !== index) {
					passenger.is_primary_passenger = false;
				}
				return passenger;
			});
			form.setFieldsValue(values);
		},
		[form, id, mutatePrimaryPassenger]
	);

	const handleRemovePassenger = useCallback(
		(index: number, onRemoveCallback: (index: number) => void) => {
			const values = form.getFieldsValue();
			const passenger = values.passengers[index];

			if (id && passenger.id && !passenger.is_primary_passenger) {
				mutateRemovePassenger(passenger.id);
				return;
			}

			onRemoveCallback(index);
		},
		[form, id, mutateRemovePassenger]
	);

	const handleMovePassenger = useCallback(
		(index: number, direction: 'up' | 'down') => {
			const values = form.getFieldsValue();
			const passenger = values.passengers[index];
			const newIndex = direction === 'up' ? index - 1 : index + 1;

			values.passengers[index] = values.passengers[newIndex];
			values.passengers[newIndex] = passenger;
			const payload = values.passengers.map((passenger: { id: number }) => ({ id: passenger.id }));
			if (id && payload.length) {
				mutateMovePassenger(payload);
				return;
			}

			form.setFieldsValue(values);
		},
		[form, id, mutateMovePassenger]
	);

	const handleSubmit = useCallback(
		(values: { passengers: PassengerItem[] }) => {
			if (onFinish && values?.passengers?.length) {
				const passengers: PassengerItem[] = [];
				values.passengers.forEach((passenger) => {
					const newPassenger: PassengerItem = {} as PassengerItem;
					(Object.keys(passenger) as unknown as (keyof PassengerItem)[]).forEach((key) => {
						if (PASSENGER_KEYS.includes(key)) {
							if ((key === 'date_of_birth' || key === 'passport_expiry_date') && passenger[key]) {
								const date = moment(passenger[key]).format(config.dateFormat);
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								newPassenger[key] = date !== 'Invalid date' ? date : undefined;
							} else if (key === 'pickup_location' && passenger[key] === 'no-transfer') {
								newPassenger[key] = undefined;
							} else {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								newPassenger[key] = passenger[key];
							}
						}
					});
					passengers.push(newPassenger);
				});

				if (Array.isArray(passengers) && passengers.length) {
					onFinish({ passengers });
				}
			}
		},
		[onFinish]
	);

	const handleClearEmergencyContact = useCallback(
		(checked: boolean, index: number) => {
			if (!checked) {
				const values = form.getFieldsValue();
				values.passengers[index].emergency_contact_name = undefined;
				values.passengers[index].emergency_contact_telephone_number = undefined;
				values.passengers[index].emergency_contact_email = undefined;
				values.passengers[index].emergency_contact_relation = undefined;
				form.setFieldsValue(values);
			}
		},
		[form]
	);

	const { mutate: handleUpdatePassenger } = useMutation(
		({
			passengerID,
			payload,
		}: {
			passengerID: number;
			payload: API.BookingPassengerCreatePayload;
		}) => bookingsAPI.updatePassenger(id, passengerID, payload)
	);

	const handleChangePickupLocation = useCallback(
		(index: number) => {
			const values = form.getFieldsValue();
			const passenger = values.passengers[index];
			if (id && passenger?.id) {
				const payload = {
					...passenger,
					date_of_birth: passenger?.date_of_birth
						? moment(passenger.date_of_birth)?.format(config.dateFormat)
						: null,
					passport_expiry_date: passenger?.passport_expiry_date
						? moment(passenger.passport_expiry_date)?.format(config.dateFormat)
						: null,
					pickup_location:
						passenger?.pickup_location === 'no-transfer' ? undefined : passenger?.pickup_location,
				};
				handleUpdatePassenger({
					passengerID: passenger.id,
					payload: payload,
				});
			}
		},
		[form, id, handleUpdatePassenger]
	);
	return (
		<Form
			form={form}
			size='large'
			layout='vertical'
			name='dynamic_form_item'
			onFinish={handleSubmit}
			disabled={disabled}
		>
			<Alert
				showIcon
				type='warning'
				style={{ marginBottom: 24 }}
				message={t('Primary passenger listed here will be responsible for the booking details')}
			/>
			<AssignTicketModal
				width={800}
				open={!!ticketAssignModal}
				onClose={() => setTicketAssignModal(null)}
				title={t('Assign ticket')}
				passengerId={ticketAssignModal}
				onCancel={() => setTicketAssignModal(null)}
			/>
			<Form.List name='passengers'>
				{(fields, { add, remove }) => {
					return (
						<Fragment>
							{fields.map((field, index) => {
								return (
									<Fragment key={field.key}>
										<Card>
											<Row gutter={16} align='middle' justify='space-between'>
												<Col flex='1'>
													<Row gutter={16} align='middle' justify='space-between' wrap={false}>
														<Col
															flex='auto'
															style={{
																display: 'flex',
																gap: '0.75rem',
																flexWrap: 'wrap',
																alignItems: 'center',
															}}
														>
															<Typography.Title
																level={5}
																type='primary'
																style={{ display: 'inline-block' }}
																noMargin
															>
																{t('Passenger')} - {index + 1}
															</Typography.Title>
															{passengers?.[index]?.is_primary_passenger ? null : (
																<Form.Item
																	{...field}
																	valuePropName='value'
																	name={[field.name, 'passenger_type']}
																	initialValue={passengers?.[index]?.passenger_type || 'adult'}
																>
																	<Radio.Group
																		size='middle'
																		optionType='button'
																		buttonStyle='solid'
																		options={PassengerAgeGroupOptions}
																	/>
																</Form.Item>
															)}
															<Button
																size='middle'
																style={{ marginLeft: 0 }}
																icon={<TagOutlined />}
																onClick={() =>
																	setTicketAssignModal(passengers?.[index]?.id || null)
																}
																disabled={!isAllowedTo('ADD_ASSIGNEDTICKET')}
															>
																{t('Assign ticket')}
															</Button>
														</Col>
														<Col
															flex='auto'
															style={{
																display: 'flex',
																justifyContent: 'flex-end',
																alignItems: 'center',
																flexWrap: 'wrap',
																gap: '0.75rem',
															}}
														>
															<Button
																type='link'
																size='small'
																htmlType='button'
																onClick={() => {
																	const passengerID = passengers?.[index]?.id;
																	if (passengerID) {
																		mutateGeneratePassword(passengerID);
																	}
																}}
																loading={isGeneratePasswordLoading}
																disabled={!passengers?.[index]?.id}
															>
																{t('Generate New Password')}
															</Button>
															<div>
																<Button
																	size='middle'
																	type='primary'
																	htmlType='button'
																	icon={
																		passengers?.[index]?.is_primary_passenger ? (
																			<CheckOutlined />
																		) : (
																			<SwapOutlined />
																		)
																	}
																	onClick={() => handlePrimaryPassenger(index)}
																	loading={isPrimaryPassengerLoading}
																>
																	{t('Primary')}
																</Button>
																<Form.Item
																	{...field}
																	name={[field.name, 'is_primary_passenger']}
																	valuePropName='checked'
																	style={{ display: 'none' }}
																>
																	<Checkbox />
																</Form.Item>
																<Button
																	danger
																	size='middle'
																	type='primary'
																	htmlType='button'
																	icon={<DeleteOutlined />}
																	disabled={disabled || passengers?.[index]?.is_primary_passenger}
																	onClick={() => handleRemovePassenger(index, remove)}
																	loading={isRemovePassengerLoading}
																>
																	{t('Remove')}
																</Button>
															</div>
														</Col>
													</Row>
												</Col>

												<Col flex='10px'>
													<Row style={{ margin: '-16px -10px' }}>
														<Col span={12}>
															<Button
																type='link'
																size='small'
																icon={<ArrowUpOutlined />}
																style={{ padding: 0, margin: 0 }}
																disabled={disabled || index === 0}
																onClick={() => handleMovePassenger(index, 'up')}
															/>
															<Button
																type='link'
																size='small'
																icon={<ArrowDownOutlined />}
																style={{ padding: 0, margin: 0 }}
																disabled={disabled || index === fields.length - 1}
																onClick={() => handleMovePassenger(index, 'down')}
															/>
														</Col>
													</Row>
												</Col>
											</Row>
										</Card>
										<Form.Item name={[field.name, 'id']} style={{ display: 'none' }}>
											<Input type='hidden' />
										</Form.Item>
										{isAllowedTo('VIEW_ASSIGNEDTICKET') ? (
											<TicketStrip data={asssignedTicketsMap?.[passengers[index].id as number]} />
										) : null}
										<Row gutter={[16, 16]}>
											<Col xl={12} xxl={8}>
												<Form.Item
													{...field}
													label={t('First name')}
													name={[field.name, 'first_name']}
													rules={[{ required: true, message: t('First name is required!') }]}
												>
													<Input
														addonBefore={
															<Form.Item {...field} name={[field.name, 'name_title']} noStyle>
																<Select style={{ width: 80 }} options={NAME_INITIALS} />
															</Form.Item>
														}
													/>
												</Form.Item>
											</Col>
											<Col xl={12} xxl={8}>
												<Form.Item
													{...field}
													label={t('Last name')}
													name={[field.name, 'last_name']}
													rules={[{ required: true, message: t('Last name is required!') }]}
												>
													<Input />
												</Form.Item>
											</Col>
											<Col xl={12} xxl={8}>
												<Form.Item
													{...field}
													label={t('Date of birth')}
													name={[field.name, 'date_of_birth']}
												>
													<DatePicker
														style={{ width: '100%' }}
														format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
														showToday={false}
														placeholder='YYYY-MM-DD'
														disabledDate={(d) => !d || d.isAfter(new Date())}
														defaultPickerValue={
															passengers[field?.name]?.date_of_birth
																? undefined
																: DEFAULT_PICKER_VALUE
														}
													/>
												</Form.Item>
											</Col>

											<Col xl={12} xxl={8}>
												<Form.Item
													{...field}
													label={t('Email')}
													name={[field.name, 'email']}
													rules={[
														{
															required: passengers[index]?.is_primary_passenger ? true : false,
															message: t('Email address is required!'),
														},
														{
															type: 'email',
															message: t('Please enter a valid email address!'),
														},
														// {
														// 	validator(_, value, callback) {
														// 		if (validateEmail(value)) {
														// 			callback(t('This email is already added!'));
														// 		} else {
														// 			callback();
														// 		}
														// 	},
														// },
													]}
												>
													<Input type='email' />
												</Form.Item>
											</Col>
											<Col xl={12} xxl={8}>
												<Form.Item
													{...field}
													label={t('Telephone number')}
													name={[field.name, 'telephone_number']}
												>
													<Input type='tel' />
												</Form.Item>
											</Col>
											<Col xl={12} xxl={8}>
												<Form.Item
													{...field}
													initialValue='no-transfer'
													label={t('Pickup Location')}
													name={[field.name, 'pickup_location']}
												>
													<Select
														placeholder={t('Choose an option')}
														loading={isPickupLocationsLoading}
														getPopupContainer={(triggerNode) => triggerNode.parentElement}
														options={pickupLocationOptions}
														onChange={() => handleChangePickupLocation(index)}
														disabled={
															(passengers?.[field.name]?.pickup_location === 'no-transfer' ||
																!passengers?.[field.name]?.pickup_location) &&
															formPassengerTransferCount >= (totalPassengerTransfers || 0)
														}
													/>
												</Form.Item>
											</Col>
											<Col span={24}>
												<Divider orientation='left'>{t('Passport')}</Divider>
												<Row gutter={[16, 16]}>
													<Col xl={12} xxl={8}>
														<Form.Item
															{...field}
															label={t('Passport number')}
															name={[field.name, 'passport_number']}
														>
															<Input />
														</Form.Item>
													</Col>
													<Col xl={12} xxl={8}>
														<Form.Item
															{...field}
															label={t('Expiry date')}
															name={[field.name, 'passport_expiry_date']}
														>
															<DatePicker
																format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
																style={{ width: '100%' }}
																showToday={false}
																placeholder='YYYY-MM-DD'
																disabledDate={(d) => !d || d.isBefore(new Date())}
															/>
														</Form.Item>
													</Col>
													<Col xl={12} xxl={8}>
														<Form.Item
															{...field}
															label={t('Nationality')}
															name={[field.name, 'nationality']}
														>
															<Input />
														</Form.Item>
													</Col>

													<Col xl={12} xxl={8}>
														<Form.Item
															{...field}
															label={t('Birth city')}
															name={[field.name, 'passport_birth_city']}
														>
															<Input />
														</Form.Item>
													</Col>
												</Row>
											</Col>

											<Col span={24}>
												<Divider orientation='left'>
													{t(
														passengers?.[index]?.is_primary_passenger
															? 'Invoice address'
															: 'Address'
													)}
												</Divider>
												<Row gutter={[16, 16]}>
													<Col xl={24} xxl={16}>
														<Form.Item
															{...field}
															label={t(
																passengers?.[index]?.is_primary_passenger
																	? 'Invoice address'
																	: 'Address'
															)}
															name={[field.name, 'address']}
														>
															<Input />
														</Form.Item>
													</Col>
													<Col xl={12} xxl={8}>
														<Form.Item {...field} label={t('City')} name={[field.name, 'city']}>
															<Input />
														</Form.Item>
													</Col>
													<Col xl={12} xxl={8}>
														<Form.Item
															{...field}
															label={t('Post code')}
															name={[field.name, 'post_code']}
														>
															<Input />
														</Form.Item>
													</Col>
												</Row>
											</Col>

											<Col span={24}>
												<Divider orientation='left'>{t('Additional information')}</Divider>
												<Form.Item
													{...field}
													label={t(
														'Notes (This is for internal purpose only. Not visible to the customer)'
													)}
													name={[field.name, 'additional_info']}
												>
													<Input.TextArea rows={4} />
												</Form.Item>
											</Col>

											<Col span={24}>
												<Divider orientation='left'>{t('Allergy')}</Divider>
												<Form.Item
													{...field}
													key={`${field.key}allergy`}
													label={t('Does the traveler have food allergies?')}
													name={[field.name, 'allergy']}
													valuePropName='checked'
												>
													<Switch custom checkedChildren={t('Yes')} unCheckedChildren={t('No')} />
												</Form.Item>
												{passengers?.[index]?.allergy && (
													<Form.Item
														{...field}
														label={t('Allergy note')}
														name={[field.name, 'allergy_description']}
														rules={[
															{ required: true, message: t('Please input your allergy note!') },
														]}
													>
														<Input.TextArea rows={4} />
													</Form.Item>
												)}
											</Col>

											<Col span={24}>
												<Divider orientation='left'>{t('Emergency contact')}</Divider>
												<Col xl={12} xxl={8}>
													<Form.Item
														{...field}
														label={t('Do you want to add emergency contact?')}
														name={[field.name, 'is_emergency_contact']}
														valuePropName='checked'
													>
														<Switch
															custom
															checkedChildren={t('Yes')}
															unCheckedChildren={t('No')}
															onChange={(checked) => handleClearEmergencyContact(checked, index)}
														/>
													</Form.Item>
												</Col>

												{passengers?.[index]?.is_emergency_contact && (
													<Row gutter={[16, 16]}>
														<Col xl={12} xxl={8}>
															<Form.Item
																{...field}
																label={t('Name')}
																name={[field.name, 'emergency_contact_name']}
																rules={[{ required: true, message: t('Name is required!') }]}
															>
																<Input />
															</Form.Item>
														</Col>
														<Col xl={12} xxl={8}>
															<Form.Item
																{...field}
																label={t('Telephone number')}
																name={[field.name, 'emergency_contact_telephone_number']}
																rules={[
																	{ required: true, message: t('Phone number is required!') },
																]}
															>
																<Input />
															</Form.Item>
														</Col>
														<Col xl={12} xxl={8}>
															<Form.Item
																{...field}
																label={t('Email')}
																name={[field.name, 'emergency_contact_email']}
																rules={[
																	{
																		required: true,
																		message: t('Email address is required!'),
																	},
																	{
																		type: 'email',
																		message: t('Please enter a valid email address!'),
																	},
																]}
															>
																<Input type='email' />
															</Form.Item>
														</Col>
														<Col xl={12} xxl={8}>
															<Form.Item
																{...field}
																label={t('Relation')}
																name={[field.name, 'emergency_contact_relation']}
																rules={[{ required: true, message: t('Relation is required!') }]}
															>
																<Input />
															</Form.Item>
														</Col>
													</Row>
												)}
											</Col>
										</Row>
									</Fragment>
								);
							})}

							{totalPassengers !== fields?.length && (
								<Form.Item>
									<Button
										type='cancel'
										htmlType='button'
										style={{ display: 'block', margin: '0 auto' }}
										icon={<PlusOutlined />}
										onClick={() => add({ allergy: true })}
									>
										{t('Add another passenger')}
									</Button>
								</Form.Item>
							)}
						</Fragment>
					);
				}}
			</Form.List>

			<Row gutter={16} justify='center'>
				<Col>
					<Button type='default' htmlType='button' style={{ minWidth: 120 }} {...backBtnProps}>
						{t('Back')}
					</Button>
				</Col>
				<Col>
					<Button type='primary' htmlType='submit' style={{ minWidth: 120 }} loading={loading}>
						{t('Next')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

const Card = styled(AntCard)`
	margin-bottom: 16px;
	background-color: rgb(231, 238, 248);

	.ant {
		&-card-body {
			padding: 16px;
		}

		&-btn {
			margin-left: 8px;
			font-size: 14px;
		}

		&-form-item {
			display: inline-block;
			margin-bottom: 0;

			&-control-input {
				min-height: auto;
			}
		}
	}
`;
