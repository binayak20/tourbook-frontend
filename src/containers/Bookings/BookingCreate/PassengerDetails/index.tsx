/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button, ButtonProps, Switch, Typography } from '@/components/atoms';
import { GENDER_OPTIONS, NAME_INITIALS } from '@/utils/constants';
import { CheckOutlined, DeleteOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import {
	Alert,
	Card as AntCard,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	Row,
	Select,
} from 'antd';
import { FC, Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export type PassengerItem = API.BookingCreatePayload['passengers'][number];

type PassengerDetailsProps = {
	totalPassengers: number;
	backBtnProps?: ButtonProps;
	onFinish?: (values: PassengerItem[]) => void;
};

export const PassengerDetails: FC<PassengerDetailsProps> = (props) => {
	const { totalPassengers, backBtnProps, onFinish } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [passengerCount, setPassengerCount] = useState([0]);
	const passengers: any[] = Form.useWatch('passengers', form);

	// Validate email
	const validateEmail = useCallback(
		(email: string) => {
			return false;
		},
		[passengers]
	);

	// Form submit store passenger data to state, If form is invisible, show form when submit
	const handleSubmit = useCallback((values: PassengerItem) => {
		console.log('values', values);
		return;
	}, []);

	return (
		<Form
			form={form}
			size='large'
			layout='vertical'
			name='dynamic_form_item'
			onFinish={handleSubmit}
		>
			<Alert
				showIcon
				type='warning'
				style={{ marginBottom: 24 }}
				message={t('Primary passenger listed here will be responsible for the booking details')}
			/>
			<Form.List
				name='passengers'
				// initialValue={[{ name: 0, key: 0, isListField: true, fieldKey: 0 }]}
			>
				{(fields, { add, remove }) => {
					return (
						<Fragment>
							{fields.map((field, index) => {
								return (
									<Fragment key={field.key}>
										<Card>
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
															passengers[index]?.is_primary_passenger ? (
																<CheckOutlined />
															) : (
																<SwapOutlined />
															)
														}
														onClick={() =>
															form.setFieldsValue({
																passengers: [
																	...passengers.slice(0, index),
																	{
																		...passengers[index],
																		is_primary_passenger: !passengers[index].is_primary_passenger,
																	},
																],
															})
														}
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
													{index > 0 && (
														<Button
															danger
															size='middle'
															type='primary'
															htmlType='button'
															icon={<DeleteOutlined />}
															onClick={() => remove(index)}
														>
															{t('Remove')}
														</Button>
													)}
												</Col>
											</Row>
										</Card>

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
													rules={[{ required: true, message: t('Date of birth is required!') }]}
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
																typeof passengers[index]?.is_adult === 'boolean'
																	? passengers[index]?.is_adult
																	: true,
															message: t('Email address is required!'),
														},
														{
															type: 'email',
															message: t('Please enter a valid email address!'),
														},
														{
															validator(_, value, callback) {
																if (validateEmail(value)) {
																	callback(t('This email is already added!'));
																} else {
																	callback();
																}
															},
														},
													]}
												>
													<Input type='email' />
												</Form.Item>
											</Col>
											<Col xl={12} xxl={8}>
												<Form.Item {...field} label={t('Gender')} name={[field.name, 'gender']}>
													<Select placeholder={t('Choose an option')} options={GENDER_OPTIONS} />
												</Form.Item>
											</Col>
											<Col xl={12} xxl={8}>
												<Form.Item
													{...field}
													label={t('Telephone number')}
													name={[field.name, 'telephone']}
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
															name={[field.name, 'expiry_date']}
														>
															<DatePicker
																style={{ width: '100%' }}
																showToday={false}
																placeholder='YYYY-MM-DD'
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
															name={[field.name, 'birth_city']}
														>
															<Input />
														</Form.Item>
													</Col>
												</Row>
											</Col>

											<Divider orientation='left'>{t('Additional information')}</Divider>
											<Col xl={12} xxl={8}>
												<Form.Item
													{...field}
													label={t('Note')}
													name={[field.name, 'additional_info']}
												>
													<Input.TextArea rows={4} />
												</Form.Item>
											</Col>
											<Col xl={12} xxl={8}>
												<Form.Item
													{...field}
													label={t('Does the traveler have food allergies?')}
													name='allergy'
													valuePropName='checked'
												>
													<Switch custom checkedChildren={t('Yes')} unCheckedChildren={t('No')} />
												</Form.Item>
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

												{passengers[index]?.is_emergency_contact && (
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
										{t('Add another')}
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
