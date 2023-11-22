import { Button, Switch, Typography } from '@/components/atoms';
import { PassengerItem } from '@/containers/Bookings/BookingCreate/types';
import { DEFAULT_PICKER_VALUE, NAME_INITIALS } from '@/utils/constants';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import {
	Badge,
	Checkbox,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	Radio,
	Row,
	Select,
	theme,
} from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWidgetState } from '../libs/WidgetContext';

interface WidgetPassengerDetailsFormProps {
	form: FormInstance<any>;
	onFinish: (values: any) => void;
	maxCapacity?: number;
}

export const WidgetPassengerDetailsForm: FC<WidgetPassengerDetailsFormProps> = ({
	form,
	onFinish,
	maxCapacity = 1,
}) => {
	const { t } = useTranslation('translationWidget');
	const { state, updateState } = useWidgetState();
	const { token } = theme.useToken();
	const passengers: Partial<PassengerItem>[] = Form.useWatch('passengers', form);
	const passengerTypeOptions = [
		{
			label: t('Adult'),
			value: 'adult',
		},
		{
			label: t('Child'),
			value: 'child',
		},
		{
			label: t('Infant'),
			value: 'infant',
		},
	];

	const intialFormValue = useMemo(() => {
		const passengers = [];
		for (let i = 0; i < Number(state?.remaining_capacity || 1); i++) {
			passengers.push({
				first_name: '',
				last_name: '',
				allergy: true,
				is_primary_passenger: i === 0,
				passenger_type: 'adult',
				transportation: true,
			});
		}
		return {
			passengers,
		};
	}, [state]);

	return (
		<Form
			form={form}
			initialValues={intialFormValue}
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
										<Row gutter={[16, 0]} className={`${index !== 0 ? 'fade-slide-in' : ''}`}>
											<Col span={24}>
												<Row justify='space-between' style={{ marginBottom: '1rem' }} wrap={false}>
													<Col flex={1}>
														<Row gutter={[16, 16]}>
															<Col>
																<Typography.Title level={5} type='primary' noMargin>
																	{t('Passenger')} - {index + 1}
																</Typography.Title>
															</Col>
															<Col>
																<Form.Item name={[field.name, 'passenger_type']} noStyle>
																	<Radio.Group
																		optionType='button'
																		buttonStyle='solid'
																		options={passengerTypeOptions}
																		size='small'
																		style={{ marginBottom: '0.23rem' }}
																		disabled={passengers?.[field.name]?.is_primary_passenger}
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
													<Col
														span={8}
														style={{
															display: 'flex',
															justifyContent: 'flex-end',
														}}
													>
														{index === 0 ? (
															<span
																style={{
																	position: 'absolute',
																	right: '0',
																}}
															>
																<Badge color={token.colorPrimary} count={t('Primary passenger')} />
															</span>
														) : (
															<Button
																size='small'
																danger
																onClick={() => {
																	remove(index),
																		updateState({
																			remaining_capacity: (
																				Number(state?.remaining_capacity) - 1
																			)?.toString(),
																		});
																}}
																icon={<CloseOutlined />}
															/>
														)}
													</Col>
												</Row>
											</Col>
											<Col span={24} md={12}>
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
											<Col span={24} md={12}>
												<Form.Item
													label={t('Last name')}
													name={[field.name, 'last_name']}
													rules={[{ required: true, message: t('Last name is required!') }]}
												>
													<Input />
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item label={t('Date of birth')} name={[field.name, 'date_of_birth']}>
													<DatePicker
														format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
														style={{ width: '100%' }}
														showToday={false}
														placeholder='YYYY-MM-DD'
														disabledDate={(d) => !d || d.isAfter(new Date())}
														defaultValue={
															passengers?.[field?.name]?.date_of_birth
																? undefined
																: DEFAULT_PICKER_VALUE
														}
													/>
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item
													label={t('Email')}
													name={[field.name, 'email']}
													rules={[
														{
															required:
																index === 0 ||
																passengers?.[index]?.is_primary_passenger ||
																passengers?.[index]?.passenger_type === 'adult',
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
											<Col span={24} md={12}>
												<Form.Item
													label={t('Telephone number')}
													name={[field.name, 'telephone_number']}
													rules={[{ required: true, message: t('Phone number is required!') }]}
												>
													<Input />
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item
													label={t('Take transportation')}
													name={[field.name, 'transportation']}
													valuePropName='checked'
												>
													<Switch custom checkedChildren={t('Yes')} unCheckedChildren={t('No')} />
												</Form.Item>
											</Col>
											<Divider orientation='left'>{t('Address')}</Divider>
											<Col span={24}>
												<Form.Item label={t('Address')} name={[field.name, 'address']}>
													<Input />
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item label={t('City')} name={[field.name, 'city']}>
													<Input />
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item label={t('Post code')} name={[field.name, 'post_code']}>
													<Input />
												</Form.Item>
											</Col>
											<Divider orientation='left'>{t('Allergy')}</Divider>
											<Col span={24}>
												<Form.Item
													key={`${field.key}allergy`}
													label={t('Does the traveller have any allergies?')}
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
										htmlType='button'
										style={{ display: 'block', margin: '0 auto' }}
										icon={<PlusOutlined />}
										disabled={Number(state?.remaining_capacity) >= maxCapacity}
										onClick={() => {
											updateState({
												remaining_capacity: (
													(Number(state?.remaining_capacity) || 1) + 1
												)?.toString(),
											});
											add({
												first_name: '',
												last_name: '',
												allergy: true,
												is_primary_passenger: false,
												passenger_type: 'adult',
												transportation: true,
											});
										}}
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
