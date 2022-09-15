import { Switch } from '@/components/atoms';
import { GENDER_OPTIONS, NAME_INITIALS } from '@/utils/constants';
import { Col, DatePicker, Divider, Form, Input, Row, Select } from 'antd';
import { FormInstance } from 'rc-field-form';
import { FC, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

type PassengerFormProps = {
	form: FormInstance;
	checkEmailExists?: (email: string) => boolean;
};

export const PassengerForm: FC<PassengerFormProps> = ({ form, checkEmailExists }) => {
	const { t } = useTranslation();
	const isEmailRequired = Form.useWatch('is_adult', form);
	const isEmergencyContactRequired = Form.useWatch('is_emergency_contact', form);

	return (
		<Form.List name='sights'>
			{(fields, { add, remove }) => (
				<Fragment>
					{fields.map((field) => (
						<Fragment key={field.key}>
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
												required: isEmailRequired,
												message: t('Email address is required!'),
											},
											{
												type: 'email',
												message: t('Please enter a valid email address!'),
											},
											{
												validator(_, value, callback) {
													if (checkEmailExists?.(value)) {
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
												// rules={[{ required: true, message: t('Date of birth is required!') }]}
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
									<Form.Item {...field} label={t('Note')} name={[field.name, 'additional_info']}>
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

									{isEmergencyContactRequired && (
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
													label={t('Phone number')}
													name={[field.name, 'emergency_contact_telephone_number']}
													rules={[{ required: true, message: t('Phone number is required!') }]}
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
															required: isEmailRequired,
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
					))}
				</Fragment>
			)}
		</Form.List>
	);
};
