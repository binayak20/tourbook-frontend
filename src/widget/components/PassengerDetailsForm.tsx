import { Button, Switch, Typography } from '@/components/atoms';
import { PassengerItem } from '@/containers/Bookings/BookingCreate/types';
import { NAME_INITIALS } from '@/utils/constants';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Badge, Checkbox, Col, DatePicker, Divider, Form, Input, Row, Select } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface PassengerDetailsFormProps {
	form: FormInstance<any>;
	onFinish: (values: any) => void;
}

export const PassengerDetailsForm: FC<PassengerDetailsFormProps> = ({ form, onFinish }) => {
	const { t } = useTranslation();
	const passengers: Partial<PassengerItem>[] = Form.useWatch('passengers', form);

	return (
		<Form
			form={form}
			initialValues={{
				passengers: [
					{
						first_name: '',
						last_name: '',
						allergy: true,
						is_primary_passenger: true,
					},
				],
			}}
			layout='vertical'
			name='passenger_details_form'
			onFinish={onFinish}
		>
			<Form.List name='passengers'>
				{(fields, { add, remove }) => {
					return (
						<Row gutter={[0, 16]}>
							{fields.map((field, index) => {
								return (
									<Col span={24} key={field.key}>
										<Row
											gutter={[16, 0]}
											style={{
												border: 'dashed 1px rgba(0,0,0,.1)',
												padding: '1rem',
												borderRadius: '2px',
											}}
											className={`${index !== 0 ? 'fade-slide-in' : ''}`}
										>
											<Col span={24}>
												<Row
													justify={'space-between'}
													align='bottom'
													style={{ marginBottom: '1rem' }}
												>
													<Col>
														<Row gutter={[12, 12]} align='bottom'>
															<Col>
																<Typography.Title
																	level={5}
																	type='primary'
																	style={{ marginBottom: '0.23rem' }}
																>
																	{t('Passenger')} - {index + 1}
																</Typography.Title>
															</Col>
															<Col>
																<Form.Item
																	name={[field.name, 'is_adult']}
																	valuePropName='checked'
																	style={{ marginBottom: '0' }}
																>
																	<Switch
																		defaultChecked={true}
																		checkedChildren={t('Adult')}
																		unCheckedChildren={t('Child')}
																	/>
																</Form.Item>
																<Form.Item
																	name={[field.name, 'is_primary_passenger']}
																	valuePropName='checked'
																	style={{ display: 'none' }}
																>
																	<Checkbox />
																</Form.Item>
															</Col>
														</Row>
													</Col>
													{index === 0 ? (
														<Badge status='processing' count='Primary Passenger' />
													) : (
														<Button
															size='small'
															danger
															onClick={() => remove(index)}
															icon={<CloseOutlined />}
														/>
													)}
												</Row>
											</Col>
											<Col span={12}>
												<Form.Item
													label={t('First name')}
													name={[field.name, 'first_name']}
													rules={[{ required: true, message: t('First name is required!') }]}
												>
													<Input
														addonBefore={
															<Form.Item name={[field.name, 'name_title']} noStyle>
																<Select style={{ width: 80 }} options={NAME_INITIALS} />
															</Form.Item>
														}
													/>
												</Form.Item>
											</Col>
											<Col span={12}>
												<Form.Item
													label={t('Last name')}
													name={[field.name, 'last_name']}
													rules={[{ required: true, message: t('Last name is required!') }]}
												>
													<Input />
												</Form.Item>
											</Col>
											<Col xl={12}>
												<Form.Item label={t('Date of birth')} name={[field.name, 'date_of_birth']}>
													<DatePicker
														style={{ width: '100%' }}
														showToday={false}
														placeholder='YYYY-MM-DD'
														disabledDate={(d) => !d || d.isAfter(new Date())}
														// defaultPickerValue={
														// 	passengers[field?.name]?.date_of_birth
														// 		? undefined
														// 		: DEFAULT_PICKER_VALUE
														// }
													/>
												</Form.Item>
											</Col>
											<Col xl={12}>
												<Form.Item
													label={t('Email')}
													name={[field.name, 'email']}
													// rules={[
													// 	{
													// 		required:
													// 			index > 0 && passengers?.[0].is_adult
													// 				? false
													// 				: typeof passengers?.[index]?.is_adult === 'boolean'
													// 				? passengers?.[index]?.is_adult
													// 				: true,
													// 		message: t('Email address is required!'),
													// 	},
													// 	{
													// 		type: 'email',
													// 		message: t('Please enter a valid email address!'),
													// 	},
													// ]}
												>
													<Input type='email' />
												</Form.Item>
											</Col>
											<Col xl={12}>
												<Form.Item
													label={t('Telephone number')}
													name={[field.name, 'telephone_number']}
													rules={[{ required: true, message: t('Phone number is required!') }]}
												>
													<Input />
												</Form.Item>
											</Col>
											<Divider orientation='left'>{t('Address')}</Divider>
											<Col xl={24}>
												<Form.Item label={t('Address')} name={[field.name, 'address']}>
													<Input />
												</Form.Item>
											</Col>
											<Col xl={12}>
												<Form.Item label={t('City')} name={[field.name, 'city']}>
													<Input />
												</Form.Item>
											</Col>
											<Col xl={12}>
												<Form.Item label={t('Post code')} name={[field.name, 'post_code']}>
													<Input />
												</Form.Item>
											</Col>
											<Divider orientation='left'>{t('Allergy')}</Divider>
											<Col span={24}>
												<Form.Item
													key={`${field.key}allergy`}
													label={t('Does the traveler have food allergies?')}
													name={[field.name, 'allergy']}
													valuePropName='checked'
												>
													<Switch custom checkedChildren={t('Yes')} unCheckedChildren={t('No')} />
												</Form.Item>
												{passengers?.[index]?.allergy && (
													<Form.Item
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
										</Row>
									</Col>
								);
							})}
							<Col span={24}>
								<Form.Item noStyle>
									<Button
										size='large'
										type='cancel'
										htmlType='button'
										style={{ display: 'block', margin: '0 auto' }}
										icon={<PlusOutlined />}
										onClick={() => add({ allergy: true })}
									>
										{t('Add another passenger')}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					);
				}}
			</Form.List>
		</Form>
	);
};
