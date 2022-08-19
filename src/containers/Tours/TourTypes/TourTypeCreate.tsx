import { Typography } from '@/components/atoms';
import {
	currenciesAPI,
	fortnoxAPI,
	locationsAPI,
	stationsAPI,
	toursAPI,
	vehiclesAPI,
} from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueries } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { SupplementsPicker } from './SupplementsPicker';

export const TourTypeCreate = () => {
	const [vehicleCapacity, setVehicleCapacity] = useState(0);
	const [supplements, setSupplements] = useState<API.Supplement[]>([]);
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const navigate = useNavigate();

	const navigateToList = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.TOURS_TYPES}`);
	}, [navigate]);

	const [
		{ data: vehicles, isLoading: isVehiclesLoading },
		{ data: territories, isLoading: isTerritoriesLoading },
		{ data: countries, isLoading: isCountriesLoading },
		{ data: fortnoxCostCenters, isLoading: isFortnoxCostCentersLoading },
		{ data: tourCategories, isLoading: isTourCategoriesLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
		{ data: stations, isLoading: isStationsLoading },
	] = useQueries([
		{ queryKey: ['vehicles'], queryFn: () => vehiclesAPI.list() },
		{ queryKey: ['territories'], queryFn: () => locationsAPI.territories() },
		{ queryKey: ['countries'], queryFn: () => locationsAPI.countries() },
		{ queryKey: ['fortnoxCostCenters'], queryFn: () => fortnoxAPI.costCenters() },
		{ queryKey: ['tourCategories'], queryFn: () => toursAPI.categories() },
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list() },
		{ queryKey: ['stations'], queryFn: () => stationsAPI.list() },
	]);

	const {
		mutate: mutateLocations,
		data: locations,
		isLoading: isLocationsLoading,
	} = useMutation((territoryID: number) => locationsAPI.list({ page: 1, territory: territoryID }));

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

	const handleTerritoryChange = useCallback(
		(value: number) => {
			form.resetFields(['location']);
			mutateLocations(value);
		},
		[form, mutateLocations]
	);

	const handleRemoveSupplement = useCallback((ID: number) => {
		setSupplements((prev) => prev.filter((supplement) => supplement.id !== ID));
	}, []);

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

	const handleSubmit = useCallback(
		(values: Omit<API.TourTypeCreatePayload, 'capacity' | 'supplements'>) => {
			const payload: API.TourTypeCreatePayload = {
				...values,
				capacity: vehicleCapacity,
				supplements: supplements.map((supplement) => supplement.id),
			};

			mutateCreateType(payload);
		},
		[mutateCreateType, supplements, vehicleCapacity]
	);

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Create tour type')}
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
									<InputNumber style={{ width: '100%' }} />
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
									/>
								</Form.Item>
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
									label={t('Tour type category')}
									name='tour_type_category'
									rules={[{ required: true, message: t('Category is required!') }]}
								>
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
										options={currencies?.results?.map(({ id, currency_code }) => ({
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
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Transfer cost')}
									name='transfer_price'
									rules={[{ required: true, message: t('Please enter transfer cost!') }]}
								>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Cancel fee (percent)')}
									name='cancel_fee_percent'
									rules={[{ required: true, message: t('Please enter cancelation fee!') }]}
								>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Travel insurance fee (percent)')}
									name='travel_insurance_percent'
									rules={[{ required: true, message: t('Please enter travel insurance fee!') }]}
								>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Booking fee (percent)')}
									name='booking_fee_percent'
									rules={[{ required: true, message: t('Please enter booking fee!') }]}
								>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Station')}
									name='stations'
									rules={[{ required: true, message: t('Station is required!') }]}
								>
									<Select
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
								<Button type='default' style={{ minWidth: 180 }} onClick={navigateToList}>
									{t('Cancel')}
								</Button>
							</Col>
							<Col>
								<Button
									htmlType='submit'
									type='primary'
									loading={isLoading}
									style={{ minWidth: 180 }}
								>
									{t('Save tour type')}
								</Button>
							</Col>
						</Row>
					</Form>
				</Card>
			</Col>
		</Row>
	);
};
