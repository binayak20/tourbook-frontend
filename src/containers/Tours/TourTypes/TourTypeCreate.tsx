import { Typography } from '@/components/atoms';
import {
	accommAPI,
	currenciesAPI,
	fortnoxAPI,
	locationsAPI,
	stationsAPI,
	toursAPI,
	vehiclesAPI,
} from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueries, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { SupplementsPicker } from './SupplementsPicker';

type TourTypeUpdateProps = {
	mode?: 'create' | 'update';
};

export const TourTypeCreate: FC<TourTypeUpdateProps> = ({ mode }) => {
	const [vehicleCapacity, setVehicleCapacity] = useState(0);
	const [supplements, setSupplements] = useState<Pick<API.Supplement, 'id' | 'name'>[]>([]);
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { id } = useParams() as unknown as { id: number };

	const navigateToList = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.TOURS_TYPES}`);
	}, [navigate]);

	// Set form initial values
	useEffect(() => {
		form.setFieldsValue({
			duration: 7,
			currency: 'SEK',
			booking_fee_percent: 40,
		});
	}, [form]);

	// Mutate countries based on the selected territory
	const {
		mutate: mutateCountries,
		data: countries,
		isLoading: isCountriesLoading,
	} = useMutation((territory: number) => locationsAPI.countries({ territory }));

	// Mutate locations based on the selected country
	const {
		mutate: mutateLocations,
		data: locations,
		isLoading: isLocationsLoading,
	} = useMutation((parmas: Pick<API.LocationParams, 'territory' | 'country'>) =>
		locationsAPI.list(parmas)
	);

	// Mutate stations based on the selected station type
	const {
		mutate: mutateStations,
		data: stations,
		isLoading: isStationsLoading,
	} = useMutation((stationTypeID: number) => stationsAPI.list({ station_type: stationTypeID }));

	// Get tour type data
	useQuery(['tourType'], () => toursAPI.tourType(id!), {
		enabled: !!id && mode === 'update',
		onSuccess: (data) => {
			if (data && Object.entries(data).length) {
				const mappedValues = (Object.keys(data) as Array<keyof API.TourType>).reduce((acc, key) => {
					if (
						key === 'vehicles' ||
						key === 'supplements' ||
						key === 'accommodations' ||
						key === 'stations'
					) {
						if (key === 'supplements') {
							const mappedSupplements = data[key].map(({ id, name }) => ({ id, name }));
							setSupplements(mappedSupplements);
						} else {
							acc[key] = data[key].map(({ id }) => id);
						}
					} else if (
						key === 'territory' ||
						key === 'country' ||
						key === 'location' ||
						key === 'currency' ||
						key === 'tour_type_category' ||
						key === 'fortnox_cost_center' ||
						key === 'station_type'
					) {
						const value = data[key].id;
						if (key === 'territory' && value) {
							mutateCountries(value);
						} else if (key === 'country' && value) {
							const territory = data.territory.id;
							mutateLocations({ territory, country: value });
						} else if (key === 'station_type' && value) {
							mutateStations(value);
						}

						acc[key] = value;
					} else if (key === 'capacity') {
						setVehicleCapacity(data[key]);
					} else {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						acc[key] = data[key];
					}

					return acc;
				}, {} as Omit<API.TourTypeCreatePayload, 'capacity' | 'supplements'>);

				form.setFieldsValue(mappedValues);
			}
		},
	});

	// Call all the APIs to render the form with data
	const [
		{ data: vehicles, isLoading: isVehiclesLoading },
		{ data: territories, isLoading: isTerritoriesLoading },
		{ data: fortnoxCostCenters, isLoading: isFortnoxCostCentersLoading },
		{ data: tourCategories, isLoading: isTourCategoriesLoading },
		{ data: accommodations, isLoading: isAccommodationsLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
		{ data: stationsTypes, isLoading: isStationsTypesLoading },
	] = useQueries([
		{ queryKey: ['vehicles'], queryFn: () => vehiclesAPI.list() },
		{ queryKey: ['territories'], queryFn: () => locationsAPI.territories() },
		{ queryKey: ['fortnoxCostCenters'], queryFn: () => fortnoxAPI.costCenters() },
		{ queryKey: ['tourCategories'], queryFn: () => toursAPI.categories() },
		{ queryKey: ['accommodations'], queryFn: () => accommAPI.list() },
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list() },
		{ queryKey: ['stationsTypes'], queryFn: () => stationsAPI.types() },
	]);

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

	// Call the countries mutation on territory change
	const handleTerritoryChange = useCallback(
		(value: number) => {
			form.resetFields(['country', 'location']);
			mutateCountries(value);
		},
		[form, mutateCountries]
	);

	// Call the locations mutation on country change
	const handleCountryChange = useCallback(
		(value: number) => {
			form.resetFields(['location']);
			const territory = form.getFieldValue('territory');
			mutateLocations({ territory, country: value });
		},
		[form, mutateLocations]
	);

	// Call the stations mutation on station type change
	const handleStationTypeChange = useCallback(
		(value: number) => {
			form.resetFields(['stations']);
			mutateStations(value);
		},
		[form, mutateStations]
	);

	// Remove a supplement from the list
	const handleRemoveSupplement = useCallback((ID: number) => {
		setSupplements((prev) => prev.filter((supplement) => supplement.id !== ID));
	}, []);

	// Tour type create mutation
	const { mutate: mutateCreateType, isLoading } = useMutation(
		(payload: API.TourTypeCreatePayload) => toursAPI.createType(payload),
		{
			onSuccess: () => {
				message.success(t('Tour type has been created!'));
				navigateToList();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	// Tour type update mutation
	const { mutate: mutateUpdateType, isLoading: isUpdateLoading } = useMutation(
		(payload: API.TourTypeCreatePayload) => toursAPI.updateTourType(id, payload),
		{
			onSuccess: () => {
				message.success(t('Tour type has been updated!'));
				navigateToList();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	// Call tour type create mutation with mapped payload
	const handleSubmit = useCallback(
		(values: Omit<API.TourTypeCreatePayload, 'capacity' | 'supplements'>) => {
			const payload: API.TourTypeCreatePayload = {
				...values,
				capacity: vehicleCapacity,
				supplements: supplements.map((supplement) => supplement.id),
			};

			if (id && mode === 'update') {
				mutateUpdateType(payload);
			} else {
				mutateCreateType(payload);
			}
		},
		[id, mode, mutateCreateType, mutateUpdateType, supplements, vehicleCapacity]
	);

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t(mode === 'update' ? 'Update tour type' : 'Create tour type')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Form form={form} size='large' layout='vertical' onFinish={handleSubmit}>
						<Row gutter={[16, 16]}>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Name')}
									name='name'
									rules={[{ required: true, message: t('Please enter name of tour type!') }]}
								>
									<Input placeholder={t('Name of tour type')} />
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
										disabled
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
									name='booking_fee_percent'
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

						<SupplementsPicker
							items={supplements}
							onRemove={handleRemoveSupplement}
							onSubmit={setSupplements}
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
									loading={isLoading || isUpdateLoading}
									style={{ minWidth: 120 }}
								>
									{t(mode === 'update' ? 'Update' : 'Create')}
								</Button>
							</Col>
						</Row>
					</Form>
				</Card>
			</Col>
		</Row>
	);
};
