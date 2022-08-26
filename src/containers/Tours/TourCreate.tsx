import { Button, Typography } from '@/components/atoms';
import { toursAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import {
	Card,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	message,
	Row,
	Select,
	Switch,
} from 'antd';
import moment from 'moment';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { FormSkeleton } from './FormSkeleton';
import { useInputChange } from './hooks/useInputChange';
import { useSupplements } from './hooks/useSupplements';
import { useTFData } from './hooks/useTFData';
import { useTFUpdate } from './hooks/useTFUpdate';
import { useTourTypeChange } from './hooks/useTourTypeChange';
import { useTTFData } from './hooks/useTTFData';
import { SupplementsPicker } from './TourTypes/SupplementsPicker';

const dateFormat = 'YYYY-MM-DD';

type TourUpdateProps = {
	mode?: 'create' | 'update';
};

export const TourCreate: FC<TourUpdateProps> = ({ mode }) => {
	const [vehicleCapacity, setVehicleCapacity] = useState(0);
	const [isReserved, setReserved] = useState(false);
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { id } = useParams() as unknown as { id: number };

	// Set form initial values
	useEffect(() => {
		form.setFieldsValue({
			duration: 7,
			currency: 2,
			booking_fee_percent: 40,
		});
	}, [form]);

	const navigateToList = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.TOURS}`);
	}, [navigate]);

	// Manage supplements
	const { supplements, handleAddSupplement, handleRemoveSupplement, handleClearSupplements } =
		useSupplements();

	// Input chnage mutations
	const {
		handleTerritoryChange,
		handleCountryChange,
		handleStationTypeChange,
		mutateCountries,
		mutateLocations,
		mutateStations,
		isCountriesLoading,
		isLocationsLoading,
		isStationsLoading,
		countries,
		locations,
		stations,
	} = useInputChange(form);

	// Get tour type data
	const { isLoading: isDataLoading, isFetching: isDataFetching } = useTFUpdate({
		form,
		id,
		mode,
		supplementsCallback: handleAddSupplement,
		countriesCallback: mutateCountries,
		locationsCallback: mutateLocations,
		stationsCallback: mutateStations,
		capacityCallback: setVehicleCapacity,
		reservedCallback: setReserved,
	});

	// Tour type change mutation
	const { mutate: mutateTourType } = useTourTypeChange({
		form,
		supplementsCallback: handleAddSupplement,
		supplementsClearCallback: handleClearSupplements,
		countriesCallback: mutateCountries,
		locationsCallback: mutateLocations,
		stationsCallback: mutateStations,
		capacityCallback: setVehicleCapacity,
		reservedCallback: setReserved,
	});

	// Call all the APIs to render the form with data
	const [{ data: tourTypes, isLoading: isTourTypesLoading }] = useTFData();

	const [
		{ data: vehicles, isLoading: isVehiclesLoading },
		{ data: territories, isLoading: isTerritoriesLoading },
		{ data: fortnoxCostCenters, isLoading: isFortnoxCostCentersLoading },
		{ data: tourCategories, isLoading: isTourCategoriesLoading },
		{ data: accommodations, isLoading: isAccommodationsLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
		{ data: stationsTypes, isLoading: isStationsTypesLoading },
	] = useTTFData();

	// Count vehicles capacity based on the selected vehicles
	const handleVehicleChange = useCallback(
		(value: number[]) => {
			let count = 0;

			vehicles?.forEach((vehicle) => {
				if (value.includes(vehicle.id)) {
					count += vehicle.capacity;
				}
			});

			setVehicleCapacity(count);
		},
		[vehicles]
	);

	// Tour create mutation
	const { mutate: mutateCreateTour, isLoading } = useMutation(
		(payload: API.TourCreatePayload) => toursAPI.create(payload),
		{
			onSuccess: () => {
				message.success(t('Tour has been created!'));
				navigateToList();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	// Tour update mutation
	const { mutate: mutateUpdateTour, isLoading: isTourLoading } = useMutation(
		(payload: API.TourCreatePayload) => toursAPI.update(id, payload),
		{
			onSuccess: () => {
				message.success(t('Tour has been updated!'));
				navigateToList();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	// Call tour create mutation with mapped payload
	const handleSubmit = useCallback(
		(values: Omit<API.TourCreatePayload, 'capacity' | 'supplements'>) => {
			const payload: API.TourCreatePayload = {
				...values,
				capacity: vehicleCapacity,
				supplements: supplements.map((supplement) => supplement.id),
			};

			if (values.departure_date) {
				payload.departure_date = moment(values.departure_date).format(dateFormat);
			}

			if (values.return_date) {
				payload.return_date = moment(values.return_date).format(dateFormat);
			}

			if (values.reservation_expiry_date) {
				payload.reservation_expiry_date = moment(values.reservation_expiry_date).format(dateFormat);
			}

			if (id && mode === 'update') {
				mutateUpdateTour(payload);
			} else {
				mutateCreateTour(payload);
			}
		},
		[id, mode, mutateCreateTour, mutateUpdateTour, supplements, vehicleCapacity]
	);

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t(mode === 'update' ? 'Update tour' : 'Create tour')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Form form={form} size='large' layout='vertical' onFinish={handleSubmit}>
						{isDataLoading || isDataFetching ? (
							<FormSkeleton />
						) : (
							<Fragment>
								<Row gutter={[16, 16]}>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Tour type')} name='tour_type'>
											<Select
												allowClear
												placeholder={t('Choose an option')}
												loading={isTourTypesLoading}
												options={tourTypes?.results?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
												onChange={(value) => mutateTourType(value)}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Name')}
											name='name'
											rules={[{ required: true, message: t('Please enter name of tour type!') }]}
										>
											<Input placeholder={t('Name of tour')} />
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Departure date')}
											name='departure_date'
											rules={[{ required: true, message: t('Departure date is required!') }]}
										>
											<DatePicker style={{ width: '100%' }} showToday={false} />
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Return date')}
											name='return_date'
											rules={[{ required: true, message: t('Return date is required!') }]}
										>
											<DatePicker style={{ width: '100%' }} showToday={false} />
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Vehicles')}
											name='vehicles'
											rules={[{ required: true, message: t('Vehicles is required!') }]}
										>
											<Select
												showArrow
												mode='multiple'
												placeholder={t('Choose an option')}
												loading={isVehiclesLoading}
												options={vehicles?.map(({ id, name }) => ({ value: id, label: name }))}
												onChange={handleVehicleChange}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Duration in days')}
											name='duration'
											rules={[{ required: true, message: t('Duration days is required!') }]}
										>
											<InputNumber style={{ width: '100%' }} min={0} />
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Description')} name='description'>
											<Input.TextArea rows={5} placeholder={t('Write text here...')} />
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Card style={{ backgroundColor: 'rgb(231, 238, 248)' }}>
											<Typography.Title type='primary' level={5}>
												{t('Tour capacity')}
											</Typography.Title>
											<Typography.Title type='primary' level={2} style={{ margin: 0 }}>
												{vehicleCapacity}
											</Typography.Title>
										</Card>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Fortnox cost center')}
											name='fortnox_cost_center'
											rules={[{ required: true, message: t('Fortnox cost center is required!') }]}
										>
											<Select
												placeholder={t('Choose an option')}
												loading={isFortnoxCostCentersLoading}
												options={fortnoxCostCenters?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Territory')}
											name='territory'
											rules={[{ required: true, message: t('Territory is required!') }]}
										>
											<Select
												placeholder={t('Choose an option')}
												loading={isTerritoriesLoading}
												options={territories?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
												onChange={handleTerritoryChange}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Country')}
											name='country'
											rules={[{ required: true, message: t('Country is required!') }]}
										>
											<Select
												placeholder={t('Choose an option')}
												loading={isCountriesLoading}
												options={countries?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
												onChange={handleCountryChange}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Location')}
											name='location'
											rules={[{ required: true, message: t('Location is required!') }]}
										>
											<Select
												placeholder={t('Choose an option')}
												loading={isLocationsLoading}
												options={locations?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Accommodations')} name='accommodations'>
											<Select
												showArrow
												mode='multiple'
												placeholder={t('Choose an option')}
												loading={isAccommodationsLoading}
												options={accommodations?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Tour type category')} name='tour_type_category'>
											<Select
												placeholder={t('Choose an option')}
												loading={isTourCategoriesLoading}
												options={tourCategories?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
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
												options={currencies?.map(({ id, currency_code }) => ({
													value: id,
													label: currency_code,
												}))}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Standard price (base)')}
											name='standard_price'
											rules={[{ required: true, message: t('Please enter standard price!') }]}
										>
											<InputNumber style={{ width: '100%' }} min={0} />
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
										<Form.Item
											label={t('Transfer cost')}
											name='transfer_price'
											rules={[{ required: true, message: t('Please enter transfer cost!') }]}
										>
											<InputNumber style={{ width: '100%' }} min={0} />
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Cancel fee (percent)')} name='cancel_fee_percent'>
											<InputNumber style={{ width: '100%' }} min={0} />
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Travel insurance fee (percent)')}
											name='travel_insurance_percent'
										>
											<InputNumber style={{ width: '100%' }} min={0} />
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Pickup option')} name='station_type'>
											<Select
												placeholder={t('Choose an option')}
												loading={isStationsTypesLoading}
												options={stationsTypes?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
												onChange={handleStationTypeChange}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Pickup location')} name='stations'>
											<Select
												showArrow
												mode='multiple'
												placeholder={t('Choose an option')}
												loading={isStationsLoading}
												options={stations?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
											/>
										</Form.Item>
									</Col>
								</Row>

								<Divider />

								<Form.Item
									label={t('Reserve tour capacity')}
									name='is_reserved'
									valuePropName='checked'
								>
									<Switch onChange={(e) => setReserved(e)} />
								</Form.Item>

								{isReserved && (
									<Row gutter={16}>
										<Col xl={12}>
											<Form.Item
												label={t('Reserve seats')}
												name='reserved_capacity'
												rules={[{ required: true, message: t('Reserve seats is required!') }]}
											>
												<InputNumber
													style={{ width: '100%' }}
													placeholder={t('Reserve seats')}
													min={0}
												/>
											</Form.Item>
										</Col>
										<Col xl={12}>
											<Form.Item
												label={t('Expires after')}
												name='reservation_expiry_date'
												rules={[{ required: true, message: t('Expiry date is required!') }]}
											>
												<DatePicker style={{ width: '100%' }} showToday={false} />
											</Form.Item>
										</Col>
									</Row>
								)}

								<Divider />

								<SupplementsPicker
									items={supplements}
									onRemove={handleRemoveSupplement}
									onSubmit={handleAddSupplement}
								/>

								<Row gutter={16} justify='center'>
									<Col>
										<Button type='default' style={{ minWidth: 120 }} onClick={navigateToList}>
											{t('Cancel')}
										</Button>
									</Col>
									<Col>
										<Button
											htmlType='submit'
											type='primary'
											loading={isLoading || isTourLoading}
											style={{ minWidth: 120 }}
										>
											{t(mode === 'update' ? 'Update' : 'Create')}
										</Button>
									</Col>
								</Row>
							</Fragment>
						)}
					</Form>
				</Card>
			</Col>
		</Row>
	);
};
