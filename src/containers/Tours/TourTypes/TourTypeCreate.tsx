import { SupplementsPicker, Typography } from '@/components/atoms';
import { locationsAPI, toursAPI } from '@/libs/api';
import { useSupplements } from '@/libs/hooks';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { useStoreSelector } from '@/store';
import { selectFilterBy } from '@/utils/helpers';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	message,
	Row,
	Select,
	Tooltip,
} from 'antd';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
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
	const { currencyID, minBookingFee } = useStoreSelector((state) => state.app);
	const [location, setLocation] = useState<number | null>(null);

	//getting location list from api
	const { data: locationList, isLoading: locationsLoading } = useQuery('Tour-locations', () =>
		locationsAPI.ListForAutofill()
	);

	const navigateToList = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.TOURS_TYPES}`);
	}, [navigate]);

	useEffect(() => {
		form.setFieldsValue({
			currency: currencyID,
		});
	}, [currencyID, form]);

	// Set form initial values
	useEffect(() => {
		form.setFieldsValue({
			duration: 7,
			capacity: 0,
			booking_fee_percent: minBookingFee,
		});
	}, [form, minBookingFee]);

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
		handleClearList,
		refetchSupplements,
	} = useSupplements();

	// Input chnage mutations
	const {
		handleStationTypeChange,
		mutateCountries,
		mutateLocations,
		mutateStations,
		isStationsLoading,
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
		{ data: fortnoxCostCenters, isLoading: isFortnoxCostCentersLoading },
		{ data: tourCategories, isLoading: isTourCategoriesLoading },
		{ data: accommodations, isLoading: isAccommodationsLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
		{ data: stationsTypes, isLoading: isStationsTypesLoading },
		{ data: fortnoxProjects, isLoading: isFortnoxProjectsLoading },
	] = useTTFData();

	const handleLocationChange = (value: number) => {
		setLocation(value);
		if (locationList && !locationsLoading) {
			const selectedLocation = locationList.find((item) => item.id === value);
			if (selectedLocation) {
				form.setFieldsValue({
					country: selectedLocation.country.id,
					territory: selectedLocation.territory.id,
				});
			}
		}
	};

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
												showSearch
												filterOption={selectFilterBy}
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
										<Form.Item label={t('Fortnox cost center')} name='fortnox_cost_center'>
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
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Fortnox project')} name='fortnox_project'>
											<Select
												placeholder={t('Choose an option')}
												loading={isFortnoxProjectsLoading}
												options={fortnoxProjects?.results?.map(
													({ id, project_number, description }) => ({
														value: id,
														label: (
															<Row>
																<Col span={12}>{description}</Col>
																<Col span={12}>{project_number}</Col>
															</Row>
														),
													})
												)}
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Row gutter={[16, 16]}>
											<Col xl={12} xxl={8}>
												<Form.Item label={t('Location')} name='location'>
													<Select
														showSearch
														filterOption={selectFilterBy}
														onChange={handleLocationChange}
														placeholder={t('Choose an option')}
														loading={locationsLoading}
														options={locationList?.map(({ id, name }) => ({
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
														disabled={!location}
														options={locationList
															?.filter((item) => item.id === form.getFieldValue('location'))
															.map(({ country }) => ({
																value: country.id,
																label: country.name,
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
														disabled={!location}
														options={locationList
															?.filter((item) => item.id === form.getFieldValue('location'))
															.map(({ territory }) => ({
																value: territory.id,
																label: territory.name,
															}))}
													/>
												</Form.Item>
											</Col>
										</Row>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Accommodations')} name='accommodations'>
											<Select
												showSearch
												filterOption={selectFilterBy}
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
												showSearch
												filterOption={selectFilterBy}
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
												options={currencies?.results?.map(({ id, currency_code }) => ({
													value: id,
													label: currency_code,
												}))}
												disabled
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={
												<>
													<span style={{ marginRight: '10px' }}>{t('Standard price (base)')}</span>
													<Tooltip
														style={{ paddingLeft: '40px' }}
														placement='top'
														title={t('This price includes transport costs')}
													>
														<InfoCircleOutlined />
													</Tooltip>
												</>
											}
											name='standard_price'
											rules={[{ required: true, message: t('Please enter standard price!') }]}
										>
											<InputNumber style={{ width: '100%' }} min={0} />
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
											label={
												<>
													<span style={{ marginRight: '10px' }}>{t('Transport cost')}</span>
													<Tooltip
														style={{ paddingLeft: '40px' }}
														placement='top'
														title={t(
															'Cost of flight/bus/train. This price is included in the final price. When booking, no transport will deduct the amount from the final price.'
														)}
													>
														<InfoCircleOutlined />
													</Tooltip>
												</>
											}
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
														showSearch
														filterOption={selectFilterBy}
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
														showSearch
														filterOption={selectFilterBy}
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
									onAdd={handleAddSupplement}
									onRemove={handleRemoveSupplement}
									onClearList={handleClearList}
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
