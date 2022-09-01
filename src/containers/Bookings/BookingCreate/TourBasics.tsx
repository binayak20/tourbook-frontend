/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { SupplementsPicker, Typography } from '@/components/atoms';
import { currenciesAPI, toursAPI } from '@/libs/api';
import { useSupplements } from '@/libs/hooks';
import { defaultListParams } from '@/utils/constants';
import { Button, Col, DatePicker, Divider, Form, FormProps, InputNumber, Row, Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import moment from 'moment';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

const userTypeOptions = [
	{ label: 'Individual', value: 'individual' },
	{ label: 'Business', value: 'business' },
];

const BOOKING_FEE_PERCENT = 40;

export const TourBasics: FC<FormProps> = ({ onFinish, ...rest }) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [totalPrice, setTotalPrice] = useState(0);
	const [seats, setSeats] = useState({ available: 0, total: 0 });
	const [pickupOptions, setPickupOptions] = useState<DefaultOptionType[]>([]);

	// Manage supplements
	const {
		items,
		categories,
		subCategories,
		handleCategoryChange,
		handleSubCategoryChange,
		supplements,
		handleAddSupplement,
		handleRemoveSupplement,
		handleClearSupplements,
	} = useSupplements();

	// Reset form handler
	const resetForm = useCallback(() => {
		form.resetFields();
		form.setFieldsValue({
			user_type: 'individual',
			booking_fee_percent: BOOKING_FEE_PERCENT,
		});
		setTotalPrice(0);
		setSeats({ available: 0, total: 0 });
		setPickupOptions([]);
		handleClearSupplements();
	}, [form, handleClearSupplements]);

	// Set form initial values
	useEffect(() => {
		resetForm();
	}, [resetForm]);

	// Get data to render this form
	const [
		{ data: tours, isLoading: isToursLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
	] = useQueries([
		{ queryKey: ['tours'], queryFn: () => toursAPI.list(defaultListParams) },
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list(defaultListParams) },
	]);

	// Get selected tour
	const handleTourChange = useCallback(
		(value: number) => {
			const tour = tours?.results?.find((t) => t.id === value);
			if (tour) {
				form.setFieldsValue({
					duration: [moment(tour.departure_date), moment(tour.return_date)],
					currency: tour.currency.id,
					booking_fee_percent: tour.booking_fee_percent,
				});
				setSeats({ available: tour.remaining_capacity, total: tour.capacity });
				setPickupOptions(tour.stations?.map(({ id, name }) => ({ value: id, label: name })) || []);

				if (tour?.supplements?.length) {
					handleAddSupplement(tour.supplements as unknown as API.Supplement[]);
				} else {
					handleClearSupplements();
				}

				return;
			}

			resetForm();
		},
		[form, handleAddSupplement, handleClearSupplements, resetForm, tours?.results]
	);

	// Form submit handler
	const handleSubmit = useCallback((values: any) => {
		console.log(values);
	}, []);

	return (
		<Form form={form} size='large' layout='vertical' onFinish={handleSubmit} {...rest}>
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
									onChange={handleTourChange}
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
										{seats.available}/{seats.total}
									</Typography.Title>
								</Col>
								<Col span={12}>
									<Fragment>
										<Typography.Text strong style={{ color: '#20519e' }}>
											{t('Total Price')}
										</Typography.Text>
										<Typography.Title level={3} type='primary' className='margin-0'>
											{totalPrice} SEK
										</Typography.Title>
									</Fragment>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('Duration')} name='duration'>
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
						<Select
							placeholder={t('Choose an option')}
							loading={isCurrenciesLoading}
							options={currencies?.results?.map(({ id, name }) => ({ label: name, value: id }))}
							disabled
						/>
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
						name='booking_fee_percent'
						rules={[{ required: true, message: t('Please enter booking fee!') }]}
					>
						<InputNumber style={{ width: '100%' }} min={0} />
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('Pickup location')} name='stations'>
						<Select showArrow placeholder={t('Choose an option')} options={pickupOptions} />
					</Form.Item>
				</Col>
			</Row>

			<Divider />

			<SupplementsPicker
				items={items}
				categories={categories?.results?.map(({ id, name }) => ({
					value: id,
					label: name,
				}))}
				subCategories={subCategories?.results?.map(({ id, name }) => ({
					value: id,
					label: name,
				}))}
				onCategoryChange={handleCategoryChange}
				onSubCategoryChange={handleSubCategoryChange}
				selectedItems={supplements}
				onAdd={handleAddSupplement}
				onRemove={handleRemoveSupplement}
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
