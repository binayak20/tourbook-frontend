import { Button, ButtonProps, Switch, Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { NAME_INITIALS } from '@/utils/constants';
import {
	ArrowDownOutlined,
	ArrowUpOutlined,
	CheckOutlined,
	DeleteOutlined,
	PlusOutlined,
	SwapOutlined,
} from '@ant-design/icons';
import {
	Alert,
	Card as AntCard,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Form,
	FormInstance,
	Input,
	message,
	Row,
	Select,
} from 'antd';
import moment from 'moment';
import { FC, Fragment, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

export type PassengerItem = API.BookingCreatePayload['passengers'][number] & {
	is_emergency_contact?: boolean;
};

type PassengerDetailsProps = {
	fwdRef?: React.RefObject<FormInstance>;
	data?: PassengerItem[];
	totalPassengers: number;
	backBtnProps?: ButtonProps;
	onFinish?: (values: PassengerItem[]) => void;
	disabled?: boolean;
};

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
	'is_adult',
	'allergy',
	'allergy_description',
	'additional_info',
	'is_primary_passenger',
	'emergency_contact_name',
	'emergency_contact_telephone_number',
	'emergency_contact_email',
	'emergency_contact_relation',
];

export const PassengerDetails: FC<PassengerDetailsProps> = (props) => {
	const { fwdRef, data, totalPassengers, backBtnProps, onFinish, disabled } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const passengers: PassengerItem[] = Form.useWatch('passengers', form);
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();

	useEffect(() => {
		if (data?.length) {
			form.setFieldsValue({ passengers: data });
		}
	}, [data, form]);

	const { mutate: mutatePrimaryPassenger, isLoading: isPrimaryLoading } = useMutation(
		(passengerID: number) => bookingsAPI.setPassengerAsPrimary(id, passengerID),
		{
			onSuccess: (data) => {
				message.success(data.detail);
				queryClient.invalidateQueries(['booking']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: mutateRemovePassenger, isLoading: isRemoveLoading } = useMutation(
		(passengerID: number) => bookingsAPI.deletePassenger(id, passengerID),
		{
			onSuccess: (data) => {
				message.success(data.detail);
				queryClient.invalidateQueries(['booking']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: mutateMovePassenger } = useMutation(
		(payload: Record<string, number>[]) => bookingsAPI.setPassengerSerial(id, payload),
		{
			onSuccess: () => {
				message.success(t('Passenger moved successfully!'));
				queryClient.invalidateQueries(['booking']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

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
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							newPassenger[key] =
								key === 'date_of_birth' || key === 'passport_expiry_date'
									? moment(passenger[key]).format(config.dateFormat)
									: passenger[key];
						}
					});
					passengers.push(newPassenger);
				});

				if (passengers.length) {
					onFinish(passengers);
				}
			}
		},
		[onFinish]
	);

	return (
		<Form
			ref={fwdRef}
			form={form}
			size='large'
			layout='vertical'
			name='dynamic_form_item'
			initialValues={{
				passengers: [
					{
						is_adult: true,
						is_primary_passenger: true,
					},
				],
			}}
			onFinish={handleSubmit}
			disabled={disabled}
		>
			<Alert
				showIcon
				type='warning'
				style={{ marginBottom: 24 }}
				message={t('Primary passenger listed here will be responsible for the booking details')}
			/>
			<Form.List name='passengers'>
				{(fields, { add, remove }) => {
					return (
						<Fragment>
							{fields.map((field, index) => {
								return (
									<Fragment key={field.key}>
										<Card>
											<Row gutter={16} align='middle'>
												<Col flex='auto'>
													<Row gutter={16} align='middle' justify='space-between'>
														<Col>
															<Typography.Title
																level={5}
																type='primary'
																style={{ display: 'inline-block', margin: '0 8px 0 0' }}
															>
																{t('Passenger')} - {index + 1}
															</Typography.Title>
															<Form.Item
																{...field}
																name={[field.name, 'is_adult']}
																valuePropName='checked'
															>
																<Switch
																	defaultChecked={true}
																	checkedChildren={t('Adult')}
																	unCheckedChildren={t('Child')}
																/>
															</Form.Item>
														</Col>
														<Col>
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
																loading={isPrimaryLoading}
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
																loading={isRemoveLoading}
															>
																{t('Remove')}
															</Button>
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
																<Select style={{ width: 70 }} options={NAME_INITIALS} />
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
													rules={[
														{ required: true, message: t('Date of birth is required!') },
														{
															// primary passenger must be 13 years old
															validator: (_rule, value) => {
																if (
																	passengers?.[index]?.is_primary_passenger &&
																	moment().diff(value, 'years') < 13
																) {
																	return Promise.reject(
																		t('Primary passenger must be 13 years old!')
																	);
																}
																return Promise.resolve();
															},
														},
													]}
												>
													<DatePicker
														style={{ width: '100%' }}
														showToday={false}
														placeholder='YYYY-MM-DD'
														disabledDate={(d) => !d || d.isAfter(new Date())}
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
															required:
																index > 0 && passengers?.[0].is_adult
																	? false
																	: typeof passengers?.[index]?.is_adult === 'boolean'
																	? passengers?.[index]?.is_adult
																	: true,
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
												<Divider orientation='left'>{t('Additional information')}</Divider>
												<Form.Item
													{...field}
													label={t('Note')}
													name={[field.name, 'additional_info']}
												>
													<Input.TextArea rows={4} />
												</Form.Item>
											</Col>

											<Col span={24}>
												<Divider orientation='left'>{t('Allergy')}</Divider>
												<Form.Item
													{...field}
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
														<Switch custom checkedChildren={t('Yes')} unCheckedChildren={t('No')} />
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
										onClick={add}
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
					<Button type='primary' htmlType='submit' style={{ minWidth: 120 }}>
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
