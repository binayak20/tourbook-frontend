import { SupplementsPicker, Typography } from '@/components/atoms';
import { useSupplements } from '@/libs/hooks';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { useStoreSelector } from '@/store';
import { BOOKING_USER_TYPES } from '@/utils/constants';
import { convertToCurrencyStyle } from '@/utils/helpers';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Divider, Form, InputNumber, Row, Select, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import BookingNote from './BookingNote';
import { useTourBasicsFormRenderer } from './hooks';
import { TourBasicsFormValues, TourBasicsProps } from './types';

export const TourBasics: React.FC<TourBasicsProps> = ({
	initialValues,
	totalPrice,
	onCalculate,
	onFinish,
	disabled,
	loading,
	isUpdate,
}) => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const { currencyID } = useStoreSelector((state) => state.app);
	const [form] = Form.useForm<TourBasicsFormValues>();
	const selectedTourID = Form.useWatch('tour', form);
	const numberOfPassengers = Form.useWatch('number_of_passenger', form) || 0;
	const numberOfPassengersTookTransger =
		Form.useWatch('number_of_passenger_took_transfer', form) || 0;
	const isDeparted = initialValues?.is_departed;
	const [vehicleList, setVehicleList] = useState([]);

	useEffect(() => {
		form.setFieldsValue({
			currency: currencyID,
			user_type: 'individual',
		});
	}, [form, currencyID]);

	const {
		tours,
		tourOptions,
		currencyOptions,
		fortnoxProjectOptions,
		isToursLoading,
		isCurrenciesLoading,
		isFortnoxProjectsLoading,
	} = useTourBasicsFormRenderer();

	// Bind capacity, remaining capacity and pickup options to the selected tour
	const { capacity, remaining_capacity } = useMemo(() => {
		const tour = id
			? initialValues?.tour_details
			: tours.find((tour) => tour.id === selectedTourID);

		return {
			capacity: tour?.capacity || 0,
			remaining_capacity: tour?.remaining_capacity || 0,
		};
	}, [tours, selectedTourID, id, initialValues]);

	const newRemainingCapacity = useMemo(() => {
		return (remaining_capacity || 0) + (initialValues?.number_of_passenger || 0);
	}, [initialValues?.number_of_passenger, remaining_capacity]);

	// Calculate total price when supplements is changed
	const handleCalculateTotalWithSupplements = useCallback(
		(supplements?: TourBasicsFormValues['supplements']) => {
			const { tour, currency, number_of_passenger, number_of_passenger_took_transfer } =
				form.getFieldsValue([
					'tour',
					'currency',
					'number_of_passenger',
					'number_of_passenger_took_transfer',
				]);
			if (
				number_of_passenger < number_of_passenger_took_transfer ||
				number_of_passenger > newRemainingCapacity
			)
				return;

			const supplementsArr =
				supplements?.map(({ id, selectedquantity = 1, price }) => ({
					supplement: id,
					quantity: selectedquantity,
					price,
				})) || [];

			const payload: API.BookingCostPayload = {
				tour,
				currency,
				number_of_passenger,
				number_of_passenger_took_transfer,
				coupon_or_fixed_discount_amount: initialValues?.coupon_or_fixed_discount_amount,
				discount_type: initialValues?.discount_type,
				coupon_code: initialValues?.coupon_code,
				supplements: supplementsArr,
			};

			onCalculate(payload);
		},
		[form, onCalculate, newRemainingCapacity, initialValues]
	);

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
		handleReplaceSupplements,
		refetchSupplements,
		handleUpdateSupplementPrice,
	} = useSupplements(handleCalculateTotalWithSupplements);

	// Calculate total price when form is changed
	const handleCalculateTotal = useCallback(() => {
		handleCalculateTotalWithSupplements(supplements);
	}, [handleCalculateTotalWithSupplements, supplements]);

	// Update duration, currency, booking fee, fortnox project and supplements when tour is changed
	const handleTourChange = useCallback(
		(value: number) => {
			const {
				departure_date,
				return_date,
				currency,
				booking_fee_percent,
				fortnox_project,
				supplements,
				vehicles,
			} = tours.find((tour) => tour.id === value)!;
			setVehicleList(vehicles as []);

			handleClearSupplements();
			form.resetFields(['number_of_passenger', 'user_type']);
			form.setFieldsValue({
				duration: [moment(departure_date), moment(return_date)],
				currency: currency.id,
				booking_fee_percent,
				fortnox_project: fortnox_project?.id,
			});
			if (Array.isArray(supplements) && supplements.length > 0) {
				handleAddSupplement(supplements as unknown as API.Supplement[]);
			}

			handleCalculateTotal();
		},
		[form, tours, handleClearSupplements, handleAddSupplement, handleCalculateTotal]
	);

	useEffect(() => {
		if (
			initialValues?.supplements &&
			Array.isArray(initialValues.supplements) &&
			initialValues.supplements.length > 0
		) {
			handleReplaceSupplements(initialValues.supplements);
		}
	}, [initialValues?.supplements, handleReplaceSupplements]);

	const handleSubmit = useCallback(
		(values: TourBasicsFormValues) => {
			const {
				tour,
				currency,
				number_of_passenger,
				number_of_passenger_took_transfer,
				booking_fee_percent,
				fortnox_project,
			} = values;

			const supplementsArr =
				supplements?.map(({ id, selectedquantity = 1, price }) => ({
					supplement: id,
					quantity: selectedquantity,
					price,
				})) || [];

			const payload: Partial<API.BookingCreatePayload> = {
				tour,
				currency,
				number_of_passenger,
				number_of_passenger_took_transfer,
				booking_fee_percent,
				supplements: supplementsArr,
				fortnox_project,
				vehicles: vehicleList,
			};

			onFinish(payload);
		},
		[onFinish, supplements, vehicleList]
	);

	return (
		<Form
			size='large'
			layout='vertical'
			{...{ form, initialValues, onFinish: handleSubmit, disabled }}
		>
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
								{isUpdate ? (
									<Link to={`/dashboard/${PRIVATE_ROUTES.TOURS}/edit/${initialValues?.tour}`}>
										{initialValues?.tour_details?.name}
									</Link>
								) : (
									<Select
										placeholder={t('Choose an option')}
										disabled={isUpdate}
										options={tourOptions}
										loading={isToursLoading}
										onChange={handleTourChange}
									/>
								)}
							</Form.Item>
						</Col>
						<Col xl={12} style={{ textAlign: 'center' }}>
							<Row gutter={16}>
								<Col span={12}>
									<Typography.Text strong>{t('Available Seats')}</Typography.Text>
									<Typography.Title level={3} type='primary' className='margin-0'>
										{remaining_capacity}/{capacity}
									</Typography.Title>
								</Col>
								<Col span={12}>
									<>
										<Typography.Text strong>{t('Total Price')}</Typography.Text>
										<Typography.Title level={3} type='primary' className='margin-0'>
											{convertToCurrencyStyle(totalPrice)} SEK
										</Typography.Title>
									</>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('Duration')} name='duration'>
						<DatePicker.RangePicker
							format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
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
							options={currencyOptions}
							loading={isCurrenciesLoading}
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
							{
								validator(_, value) {
									if (value >= (numberOfPassengersTookTransger || 0)) {
										return Promise.resolve();
									}

									return Promise.reject(
										new Error(
											t(
												'Number of passengers must be greater than or equal to number of passengers took transfer!'
											)
										)
									);
								},
							},
						]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={1}
							max={newRemainingCapacity}
							onChange={handleCalculateTotal}
							disabled={isDeparted}
						/>
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item
						label={
							<>
								<span style={{ marginRight: '10px' }}>
									{t('Transport required for passengers')}
								</span>
								<Tooltip
									style={{ paddingLeft: '40px' }}
									placement='top'
									title={t('Number of passengers taking transport (air/bus/train)')}
								>
									<InfoCircleOutlined />
								</Tooltip>
							</>
						}
						name='number_of_passenger_took_transfer'
						rules={[
							{ required: true, message: t('Number of passenger took transfer is required!') },
						]}
					>
						<InputNumber
							style={{ width: '100%' }}
							min={0}
							max={numberOfPassengers}
							onChange={handleCalculateTotal}
							disabled={isDeparted}
						/>
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('User type')} name='user_type'>
						<Select
							placeholder={t('Choose an option')}
							options={BOOKING_USER_TYPES}
							disabled={isDeparted}
						/>
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item
						label={t('Minimum Booking Fee (%)')}
						name='booking_fee_percent'
						rules={[{ required: true, message: t('Please enter booking fee!') }]}
					>
						<InputNumber style={{ width: '100%' }} min={0} disabled={isDeparted} />
					</Form.Item>
				</Col>
				<Col xl={12} xxl={8}>
					<Form.Item label={t('Fortnox project')} name='fortnox_project'>
						<Select
							disabled
							placeholder={t('Choose an option')}
							options={fortnoxProjectOptions}
							loading={isFortnoxProjectsLoading}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Divider />

			<SupplementsPicker
				isBooking
				colSize={id ? 12 : 8}
				items={items}
				refetchItems={refetchSupplements}
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
				onUpdateSupplementPrice={handleUpdateSupplementPrice}
			/>
			<Divider />
			{isUpdate && <BookingNote bookingId={id} />}

			<Row gutter={16} justify='center'>
				<Col>
					<Button htmlType='submit' type='primary' style={{ minWidth: 120 }} loading={loading}>
						{t('Next')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
