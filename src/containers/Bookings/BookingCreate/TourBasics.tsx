/* eslint-disable @typescript-eslint/no-empty-function */
import { Typography } from '@/components/atoms';
import { useSupplements } from '@/containers/Tours/hooks/useSupplements';
import { SupplementsPicker } from '@/containers/Tours/TourTypes/SupplementsPicker';
import { toursAPI } from '@/libs/api';
import { defaultListParams } from '@/utils/constants';
import { Button, Col, DatePicker, Divider, Form, FormProps, InputNumber, Row, Select } from 'antd';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

const userTypeOptions = [
	{ label: 'Individual', value: 'individual' },
	{ label: 'Business', value: 'business' },
];

export const TourBasics: FC<FormProps> = (props) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	// Set form initial values
	useEffect(() => {
		form.setFieldsValue({
			user_type: 'individual',
			minimum_booking_fee_percent: 40,
		});
	}, [form]);

	// Get data to render this form
	const { data: tours, isLoading: isToursLoading } = useQuery('tours', () =>
		toursAPI.list(defaultListParams)
	);

	// Manage supplements
	const { supplements, handleAddSupplement, handleRemoveSupplement } = useSupplements();

	return (
		<Form form={form} size='large' layout='vertical' {...props}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Row gutter={16} align='middle'>
						<Col xl={12}>
							<Form.Item
								label={t('Tour')}
								name='tour'
								style={{ fontWeight: 'bold' }}
								help={
									<Typography.Paragraph
										type='secondary'
										style={{
											fontSize: 14,
											fontWeight: 'normal',
											lineHeight: '16px',
											margin: '4px 0 0 0',
										}}
									>
										{t(
											'Please select the tour you want to book. If you do not see the tour you want to book, maybe you need to create a new tour'
										)}
									</Typography.Paragraph>
								}
								rules={[{ required: true, message: t('Tour is required!') }]}
							>
								<Select
									allowClear
									placeholder={t('Choose an option')}
									loading={isToursLoading}
									options={tours?.results?.map(({ id, name }) => ({ label: name, value: id }))}
								/>
							</Form.Item>
						</Col>
						<Col xl={12} style={{ textAlign: 'center' }}>
							<Row gutter={16}>
								<Col span={12}>
									<Typography.Text strong style={{ color: '#20519e' }}>
										{t('Available Seats')}
									</Typography.Text>
									<Typography.Title level={3} type='primary' className='margin-0'>
										0/16
									</Typography.Title>
								</Col>
								<Col span={12}>
									<Typography.Text strong style={{ color: '#20519e' }}>
										{t('Total Price')}
									</Typography.Text>
									<Typography.Title level={3} type='primary' className='margin-0'>
										30 012 SEK
									</Typography.Title>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('Duration')} name='currency'>
						<DatePicker.RangePicker
							placeholder={[t('Departure date'), t('Return date')]}
							style={{ width: '100%' }}
							disabled
						/>
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item
						label={t('Currency')}
						name='currency'
						rules={[{ required: true, message: t('Currency is required!') }]}
					>
						<Select placeholder={t('Choose an option')} loading={false} options={[]} disabled />
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item
						label={t('Number of passengers')}
						name='standard_price'
						rules={[{ required: true, message: t('Number of passengers is required!') }]}
					>
						<InputNumber style={{ width: '100%' }} min={0} />
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('User type')} name='user_type'>
						<Select placeholder={t('Choose an option')} options={userTypeOptions} />
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item
						label={t('Booking fee (percent)')}
						name='minimum_booking_fee_percent'
						rules={[{ required: true, message: t('Please enter booking fee!') }]}
					>
						<InputNumber style={{ width: '100%' }} min={0} />
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('Pickup location')} name='stations'>
						<Select showArrow mode='multiple' placeholder={t('Choose an option')} options={[]} />
					</Form.Item>
				</Col>
			</Row>

			<Divider />

			<SupplementsPicker
				items={supplements}
				onRemove={handleRemoveSupplement}
				onSubmit={handleAddSupplement}
			/>

			<Row gutter={16} justify='center'>
				<Col>
					<Button
						htmlType='submit'
						type='primary'
						// loading={isLoading || isUpdateLoading}
						style={{ minWidth: 120 }}
					>
						{t('Next')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
