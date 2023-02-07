import { SupplementsPicker, Typography } from '@/components/atoms';
import { useSupplements } from '@/libs/hooks';
import { useStoreSelector } from '@/store';
import { BOOKING_USER_TYPES } from '@/utils/constants';
import { Button, Col, DatePicker, Divider, Form, InputNumber, Row, Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import moment from 'moment';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useTourBasicsFormRenderer } from './hooks';
import { TourBasicsFormValues, TourBasicsProps } from './types';

const INITIAL_PICKUP_OPTIONS: DefaultOptionType[] = [
	{ value: 'no-transfer', label: 'No transfer' },
];

export const TourBasics: React.FC<TourBasicsProps> = ({
	initialValues,
	totalPrice,
	onCalculate,
	onFinish,
	disabled,
}) => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const { currencyID, minBookingFee } = useStoreSelector((state) => state.app);
	const [form] = Form.useForm<TourBasicsFormValues>();
	const selectedTourID = Form.useWatch('tour', form);

	useEffect(() => {
		form.setFieldsValue({
			currency: currencyID,
			booking_fee_percent: minBookingFee,
			user_type: 'individual',
		});
	}, [form, currencyID, minBookingFee]);

	// Calculate total price when supplements is changed
	const handleCalculateTotalWithSupplements = useCallback(
		(supplements?: TourBasicsFormValues['supplements']) => {
			const { tour, currency, number_of_passenger, number_of_passenger_took_transfer, station } =
				form.getFieldsValue([
					'tour',
					'currency',
					'number_of_passenger',
					'number_of_passenger_took_transfer',
					'station',
				]);

			const isNoTransfer = station === 'no-transfer';
			const supplementsArr =
				supplements?.map(({ id, selectedquantity }) => ({
					supplement: id,
					quantity: selectedquantity || 1,
				})) || [];

			const payload: API.BookingCostPayload = {
				tour,
				currency,
				number_of_passenger,
				number_of_passenger_took_transfer,
				is_passenger_took_transfer: !isNoTransfer,
				supplements: supplementsArr,
			};

			onCalculate(payload);
		},
		[form, onCalculate]
	);

	const {
		tours,
		tourOptions,
		currencyOptions,
		fortnoxProjectOptions,
		isToursLoading,
		isCurrenciesLoading,
		isFortnoxProjectsLoading,
	} = useTourBasicsFormRenderer();

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
	} = useSupplements(handleCalculateTotalWithSupplements);

	useEffect(() => {
		if (
			initialValues?.supplements &&
			Array.isArray(initialValues.supplements) &&
			initialValues.supplements.length > 0
		) {
			handleReplaceSupplements(initialValues.supplements);
		}
	}, [initialValues?.supplements, handleReplaceSupplements]);

	// Calculate total price when form is changed
	const handleCalculateTotal = useCallback(() => {
		handleCalculateTotalWithSupplements(supplements);
	}, [handleCalculateTotalWithSupplements, supplements]);

	// Bind capacity, remaining capacity and pickup options to the selected tour
	const { capacity, remaining_capacity, pickOptions } = useMemo(() => {
		const tour = tours.find((tour) => tour.id === selectedTourID);

		const pickOptions = (tour?.stations?.map(({ id, name }) => ({ value: id, label: name })) ||
			[]) as DefaultOptionType[];

		return {
			capacity: tour?.capacity || 0,
			remaining_capacity: tour?.remaining_capacity || 0,
			pickOptions: pickOptions.concat(INITIAL_PICKUP_OPTIONS),
		};
	}, [tours, selectedTourID]);

	const newRemainingCapacity = useMemo(() => {
		return (remaining_capacity || 0) + (initialValues?.number_of_passenger || 0);
	}, [initialValues?.number_of_passenger, remaining_capacity]);

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
			} = tours.find((tour) => tour.id === value)!;

			handleClearSupplements();
			form.resetFields(['number_of_passenger', 'user_type', 'station']);
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

	const handleSubmit = useCallback(
		(values: TourBasicsFormValues) => {
			const { tour, currency, number_of_passenger, booking_fee_percent, station, fortnox_project } =
				values;

			const isNoTransfer = station === 'no-transfer';
			const supplementsArr =
				supplements?.map(({ id, selectedquantity }) => ({
					supplement: id,
					quantity: selectedquantity || 1,
				})) || [];

			const payload: Partial<API.BookingCreatePayload> = {
				tour,
				currency,
				number_of_passenger,
				is_passenger_took_transfer: !isNoTransfer,
				booking_fee_percent,
				station: isNoTransfer ? null : station,
				supplements: supplementsArr,
				fortnox_project,
			};

			onFinish(payload);
		},
		[onFinish, supplements]
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
									disabled={!!id}
									options={tourOptions}
									loading={isToursLoading}
									onChange={handleTourChange}
								/>
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
											{totalPrice} SEK
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
									if (value >= (initialValues?.number_of_passenger || 0)) {
										return Promise.resolve();
									}

									return Promise.reject(
										new Error(
											t('Number of passengers must be greater than or equal to added passengers!')
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
							options={pickOptions}
							onChange={handleCalculateTotal}
						/>
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
					<Button htmlType='submit' type='primary' style={{ minWidth: 120 }}>
						{t('Next')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};
