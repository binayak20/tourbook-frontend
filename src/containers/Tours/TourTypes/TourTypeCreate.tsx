import { SupplementsPicker, Typography } from '@/components/atoms';
import { toursAPI } from '@/libs/api';
import { useSupplements } from '@/libs/hooks';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { useStoreSelector } from '@/store';
import { BOOKING_FEE_PERCENT } from '@/utils/constants';
import { Button, Card, Col, Divider, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { FC, Fragment, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { FormSkeleton } from '../FormSkeleton';
import { useInputChange } from '../hooks/useInputChange';
import { useTTFData } from '../hooks/useTTFData';
import { useTTFUpdate } from '../hooks/useTTFUpdate';

type TourTypeUpdateProps = {
	mode?: 'create' | 'update';
};

export const TourTypeCreate: FC<TourTypeUpdateProps> = ({ mode }) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { id } = useParams() as unknown as { id: number };
	const { currencyID } = useStoreSelector((state) => state.app);

	const navigateToList = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.TOURS_TYPES}`);
	}, [navigate]);

	// Set form initial values
	useEffect(() => {
		form.setFieldsValue({
			duration: 7,
			capacity: 0,
			currency: currencyID,
			booking_fee_percent: BOOKING_FEE_PERCENT,
		});
	}, [currencyID, form]);

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
	} = useSupplements();

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
	const { isLoading: isDataLoading, isFetching: isDataFetching } = useTTFUpdate({
		form,
		id,
		mode,
		supplementsCallback: handleAddSupplement,
		countriesCallback: mutateCountries,
		locationsCallback: mutateLocations,
		stationsCallback: mutateStations,
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
	] = useTTFData();

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
		(values: Omit<API.TourTypeCreatePayload, 'supplements'>) => {
			const payload: API.TourTypeCreatePayload = {
				...values,
				supplements: supplements?.map((supplement) => supplement.id) || [],
			};

			if (id && mode === 'update') {
				mutateUpdateType(payload);
			} else {
				mutateCreateType(payload);
			}
		},
		[id, mode, mutateCreateType, mutateUpdateType, supplements]
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
						{isDataLoading || isDataFetching ? (
							<FormSkeleton type='tourType' />
						) : (
							<Fragment>
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
										<Form.Item label={t('Vehicles')} name='vehicles'>
											<Select
												showArrow
												mode='multiple'
												placeholder={t('Choose an option')}
												loading={isVehiclesLoading}
												options={vehicles?.results?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Capacity')} name='capacity'>
											<InputNumber style={{ width: '100%' }} min={0} />
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
											<Input.TextArea rows={4} placeholder={t('Write text here...')} />
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
												options={fortnoxCostCenters?.results?.map(({ id, name }) => ({
													value: id,
													label: name,
												}))}
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Row gutter={[16, 16]}>
											<Col xl={12} xxl={8}>
												<Form.Item
													label={t('Territory')}
													name='territory'
													rules={[{ required: true, message: t('Territory is required!') }]}
												>
													<Select
														placeholder={t('Choose an option')}
														loading={isTerritoriesLoading}
														options={territories?.results?.map(({ id, name }) => ({
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
														options={countries?.results?.map(({ id, name }) => ({
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
														options={locations?.results?.map(({ id, name }) => ({
															value: id,
															label: name,
														}))}
													/>
												</Form.Item>
											</Col>
										</Row>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Accommodations')} name='accommodations'>
											<Select
												showArrow
												mode='multiple'
												placeholder={t('Choose an option')}
												loading={isAccommodationsLoading}
												options={accommodations?.results?.map(({ id, name }) => ({
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
												options={tourCategories?.results?.map(({ id, name }) => ({
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
												options={currencies?.results?.map(({ id, name }) => ({
													value: id,
													label: name,
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
									<Col span={24}>
										<Row gutter={[16, 16]}>
											<Col xl={12} xxl={8}>
												<Form.Item label={t('Pickup option')} name='station_type'>
													<Select
														placeholder={t('Choose an option')}
														loading={isStationsTypesLoading}
														options={stationsTypes?.results?.map(({ id, name }) => ({
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
														options={stations?.results?.map(({ id, name }) => ({
															value: id,
															label: name,
														}))}
													/>
												</Form.Item>
											</Col>
										</Row>
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
							</Fragment>
						)}
					</Form>
				</Card>
			</Col>
		</Row>
	);
};
