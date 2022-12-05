/* eslint-disable @typescript-eslint/no-unused-vars */
import { SupplementsPicker, Typography } from '@/components/atoms';
import config from '@/config';
import { currenciesAPI, fortnoxAPI, toursAPI } from '@/libs/api';
import { useSupplements } from '@/libs/hooks';
import { BOOKING_FEE_PERCENT, BOOKING_USER_TYPES, DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Button, Col, DatePicker, Divider, Form, FormProps, InputNumber, Row, Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import moment from 'moment';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import { useLocation } from 'react-router-dom';

export type TourBasicsFormValues = Pick<
	API.BookingCreatePayload,
	| 'tour'
	| 'currency'
	| 'number_of_passenger'
	| 'is_passenger_took_transfer'
	| 'station'
	| 'booking_fee_percent'
	| 'supplements'
	| 'fortnox_project'
>;

export type FormValues = {
	tour: number;
	duration?: Date[];
	currency: number;
	number_of_passenger: number;
	user_type?: string;
	booking_fee_percent: number;
	station?: number | string;
	fortnox_project?: number;
};

export type TourBasicsProps = Omit<FormProps, 'onFinish' | 'onFieldsChange'> & {
	totalPrice?: number;
	onFinish?: (values: TourBasicsFormValues) => void;
	onFieldsChange?: (values: API.BookingCostPayload) => void;
};

const INITIAL_PICKUP_OPTIONS: DefaultOptionType[] = [
	{ value: 'no-transfer', label: 'No transfer' },
];

export const TourBasics: FC<TourBasicsProps> = (props) => {
	const { onFinish, onFieldsChange, totalPrice = 0, ...rest } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [seats, setSeats] = useState({ available: 0, total: 0 });
	const [pickupOptions, setPickupOptions] = useState<DefaultOptionType[]>(INITIAL_PICKUP_OPTIONS);
	const { state } = useLocation() as { state?: { tourID: number } };

	// Manage supplements
	const {
		items,
		categories,
		subCategories,
		handleCategoryChange,
		handleSubCategoryChange,
		supplements,
		handleClearList,
		handleAddSupplement,
		handleRemoveSupplement,
		handleClearSupplements,
		handleIncrementQuantity,
		handleDecrementQuantity,
	} = useSupplements();

	const handleFieldsChange = useCallback(() => {
		const {
			tour,
			currency,
			number_of_passenger = 0,
			station,
		} = form.getFieldsValue() as FormValues;

		if (tour) {
			onFieldsChange?.({
				tour,
				currency,
				number_of_passenger,
				is_passenger_took_transfer: station !== 'no-transfer',
				supplements:
					supplements.map(({ id, selectedquantity }) => ({
						supplement: id,
						quantity: selectedquantity,
					})) || [],
			});
		}
	}, [form, onFieldsChange, supplements]);

	useEffect(() => {
		handleFieldsChange();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [supplements]);

	// Reset form handler
	const resetForm = useCallback(() => {
		form.resetFields();
		form.setFieldsValue({
			user_type: 'individual',
			booking_fee_percent: BOOKING_FEE_PERCENT,
		});
		setSeats({ available: 0, total: 0 });
		setPickupOptions(INITIAL_PICKUP_OPTIONS);
		handleClearSupplements();
	}, [form, handleClearSupplements]);

	// Set form initial values
	useEffect(() => {
		form.setFieldsValue({
			user_type: 'individual',
			booking_fee_percent: BOOKING_FEE_PERCENT,
		});
	}, [form, resetForm]);

	// Get data to render this form
	const [
		{ data: tours, isLoading: isToursLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
		{ data: fortnoxProjects, isLoading: isFortnoxProjectsLoading },
	] = useQueries([
		{
			queryKey: ['tours'],
			queryFn: () =>
				toursAPI.list({ ...DEFAULT_LIST_PARAMS, remaining_capacity: 1, is_active: true }),
		},
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list(DEFAULT_LIST_PARAMS) },
		{ queryKey: ['fortnoxProjects'], queryFn: () => fortnoxAPI.projects(DEFAULT_LIST_PARAMS) },
	]);

	// Get selected tour
	const handleTourChange = useCallback(
		(value: number) => {
			const tour = tours?.results?.find((t) => t.id === value);
			if (tour) {
				form.setFieldsValue({
					duration: [moment(tour.departure_date), moment(tour.return_date)],
					currency: tour.currency.id,
					fortnox_project: tour.fortnox_project.id,
					booking_fee_percent: tour.booking_fee_percent,
				});
				setSeats({ available: tour.remaining_capacity, total: tour.capacity });
				setPickupOptions([
					...INITIAL_PICKUP_OPTIONS,
					...(tour.stations?.map(({ id, name }) => ({ value: id, label: name })) || []),
				]);

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

	// If the user is coming from the tour details page, set the tour id
	useEffect(() => {
		if (state?.tourID) {
			form.setFieldsValue({ tour: state.tourID });
			handleTourChange(state.tourID);
		}
	}, [form, handleTourChange, state?.tourID]);

	const handleSubmit = useCallback(
		(values: FormValues) => {
			const { tour, currency, number_of_passenger, booking_fee_percent, station, fortnox_project } =
				values;
			const payload: TourBasicsFormValues = {
				tour,
				currency,
				number_of_passenger,
				is_passenger_took_transfer: station !== 'no-transfer',
				booking_fee_percent,
				station: station === 'no-transfer' ? null : station,
				supplements: supplements.map(({ id, selectedquantity }) => ({
					supplement: id,
					quantity: selectedquantity,
				})),
				fortnox_project,
			};

			onFinish?.(payload);
		},
		[onFinish, supplements]
	);

	return (
		<Form form={form} size='large' layout='vertical' {...rest} onFinish={handleSubmit}>
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
									placeholder={t('Choose an option')}
									loading={isToursLoading}
									options={tours?.results?.map(
										({ id, name, departure_date, remaining_capacity, capacity }) => ({
											value: id,
											label: (
												<Typography.Text style={{ fontSize: 15 }}>
													{name} - {moment(departure_date).format(config.dateFormatReadable)} (
													{remaining_capacity}/{capacity})
												</Typography.Text>
											),
										})
									)}
									onChange={(value) => {
										handleTourChange(value);
										handleFieldsChange();
									}}
								/>
							</Form.Item>
						</Col>
						<Col xl={12} style={{ textAlign: 'center' }}>
							<Row gutter={16}>
								<Col span={12}>
									<Typography.Text strong>{t('Available Seats')}</Typography.Text>
									<Typography.Title level={3} type='primary' className='margin-0'>
										{seats.available}/{seats.total}
									</Typography.Title>
								</Col>
								<Col span={12}>
									<Fragment>
										<Typography.Text strong>{t('Total Price')}</Typography.Text>
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
							options={currencies?.results?.map(({ id, currency_code }) => ({
								label: currency_code,
								value: id,
							}))}
							disabled
						/>
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item
						label={t('Number of passengers')}
						name='number_of_passenger'
						rules={[
							{ required: true, message: t('Number of passengers is required!') },
							{
								type: 'number',
								min: 1,
								message: t('Number of passengers must be greater than 0!'),
							},
						]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={0}
							max={seats.available}
							onChange={handleFieldsChange}
						/>
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('User type')} name='user_type'>
						<Select placeholder={t('Choose an option')} options={BOOKING_USER_TYPES} />
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item
						label={t('Minimum Booking Fee (%)')}
						name='booking_fee_percent'
						rules={[{ required: true, message: t('Please enter booking fee!') }]}
					>
						<InputNumber style={{ width: '100%' }} min={0} />
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item
						label={t('Pickup location')}
						name='station'
						rules={[{ required: true, message: t('Pickup location is required!') }]}
					>
						<Select
							showArrow
							placeholder={t('Choose an option')}
							options={pickupOptions}
							onChange={handleFieldsChange}
						/>
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('Fortnox project')} name='fortnox_project'>
						<Select
							disabled
							placeholder={t('Choose an option')}
							loading={isFortnoxProjectsLoading}
							options={fortnoxProjects?.results?.map(({ id, project_number }) => ({
								value: id,
								label: project_number,
							}))}
						/>
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
				onAdd={(supplements) => {
					handleAddSupplement(supplements);
					handleClearList();
				}}
				onClearList={handleClearList}
				onRemove={handleRemoveSupplement}
				onIncrement={handleIncrementQuantity}
				onDecrement={handleDecrementQuantity}
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
