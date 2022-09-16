/* eslint-disable @typescript-eslint/no-unused-vars */
import { SupplementsPicker, Typography } from '@/components/atoms';
import { currenciesAPI, toursAPI } from '@/libs/api';
import { useSupplements } from '@/libs/hooks';
import { BOOKING_USER_TYPES, DEFAULT_CURRENCY_ID, DEFAULT_LIST_PARAMS } from '@/utils/constants';
import {
	Button,
	Col,
	DatePicker,
	Divider,
	Form,
	FormInstance,
	FormProps,
	InputNumber,
	Row,
	Select,
} from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import moment from 'moment';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

export type TourBasicsFormValues = Pick<
	API.BookingCreatePayload,
	| 'tour'
	| 'currency'
	| 'number_of_passenger'
	| 'is_passenger_took_transfer'
	| 'station'
	| 'booking_fee_percent'
	| 'supplements'
>;

export type FormValues = {
	tour: number;
	duration?: Date[];
	currency: number;
	number_of_passenger: number;
	user_type?: string;
	booking_fee_percent: number;
	station?: number;
};

type Data = {
	tour?: number;
	stations: number[];
	capacity: number;
	remaining_capacity: number;
	totalPrice: number;
	supplements: any[];
};

export type TourBasicsProps = Omit<FormProps, 'onFinish' | 'onFieldsChange' | 'initialValues'> & {
	fwdRef?: React.RefObject<FormInstance>;
	data: Data;
	onFinish?: (values: TourBasicsFormValues) => void;
	onFieldsChange?: (values: API.BookingCostPayload) => void;
	isLoading?: boolean;
};

const INITIAL_PICKUP_OPTIONS: DefaultOptionType[] = [{ value: 0, label: 'No transfer' }];

export const TourBasics: FC<TourBasicsProps> = (props) => {
	const { fwdRef, onFinish, onFieldsChange, isLoading, data, ...rest } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [seats, setSeats] = useState({ available: 0, total: 0 });
	const [pickupOptions, setPickupOptions] = useState<DefaultOptionType[]>(INITIAL_PICKUP_OPTIONS);

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

	// Set form initial values
	useEffect(() => {
		handleClearSupplements();
		setSeats({
			available: data?.remaining_capacity || 0,
			total: data?.capacity || 0,
		});

		handleAddSupplement(data.supplements as unknown as API.Supplement[]);
	}, [form, data, handleAddSupplement, handleClearSupplements]);

	const handleFieldsChange = useCallback(() => {
		const {
			tour,
			currency = DEFAULT_CURRENCY_ID,
			number_of_passenger = 0,
			station,
		} = form.getFieldsValue() as FormValues;

		if (tour) {
			onFieldsChange?.({
				tour,
				currency,
				number_of_passenger,
				is_passenger_took_transfer: station !== 0,
				supplements: supplements.map(({ id }) => ({ supplement: id, quantity: 1 })) || [],
			});
		}
	}, [form, onFieldsChange, supplements]);

	// Get data to render this form
	const [
		{ data: tours, isLoading: isToursLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
	] = useQueries([
		{ queryKey: ['tours'], queryFn: () => toursAPI.list(DEFAULT_LIST_PARAMS) },
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list(DEFAULT_LIST_PARAMS) },
	]);

	useEffect(() => {
		if (data?.tour && tours?.results?.length) {
			const tour = tours.results.find((t) => t.id === data.tour);
			if (tour) {
				setPickupOptions([
					...INITIAL_PICKUP_OPTIONS,
					...(tour.stations?.map(({ id, name }) => ({ value: id, label: name })) || []),
				]);
			}
		}
	}, [data?.tour, tours?.results]);

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
				setPickupOptions([
					...INITIAL_PICKUP_OPTIONS,
					...(tour.stations?.map(({ id, name }) => ({ value: id, label: name })) || []),
				]);

				if (tour?.supplements?.length) {
					handleAddSupplement(tour.supplements as unknown as API.Supplement[]);
				} else {
					handleClearSupplements();
				}
			}
		},
		[form, handleAddSupplement, handleClearSupplements, tours?.results]
	);

	const handleSubmit = useCallback(
		(values: FormValues) => {
			const { tour, currency, number_of_passenger, booking_fee_percent, station } = values;
			const payload: TourBasicsFormValues = {
				tour,
				currency,
				number_of_passenger,
				is_passenger_took_transfer: station !== 0,
				booking_fee_percent,
				station: station !== 0 ? station : undefined,
				supplements: supplements.map(({ id }) => ({ supplement: id, quantity: 1 })),
			};

			onFinish?.(payload);
		},
		[onFinish, supplements]
	);

	return (
		<Form ref={fwdRef} form={form} size='large' layout='vertical' {...rest} onFinish={handleSubmit}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Row gutter={16} align='middle'>
						<Col xl={12}>
							<Form.Item
								label={t('Tour')}
								name='tour'
								style={{ fontWeight: 'bold' }}
								rules={[{ required: true, message: t('Tour is required!') }]}
							>
								<Select
									placeholder={t('Choose an option')}
									loading={isToursLoading}
									options={tours?.results?.map(({ id, name }) => ({ label: name, value: id }))}
									onChange={(value) => {
										handleTourChange(value);
										handleFieldsChange();
									}}
									disabled
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
											{data.totalPrice} SEK
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
						name='number_of_passenger'
						rules={[{ required: true, message: t('Number of passengers is required!') }]}
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
						label={t('Booking fee (percent)')}
						name='booking_fee_percent'
						rules={[{ required: true, message: t('Please enter booking fee!') }]}
					>
						<InputNumber style={{ width: '100%' }} min={0} />
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('Pickup location')} name='station'>
						<Select
							showArrow
							placeholder={t('Choose an option')}
							options={pickupOptions}
							onChange={handleFieldsChange}
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
				onAdd={handleAddSupplement}
				onRemove={handleRemoveSupplement}
			/>

			<Row gutter={16} justify='center'>
				<Col>
					<Button htmlType='submit' type='primary' loading={isLoading} style={{ minWidth: 120 }}>
						{t('Save')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
