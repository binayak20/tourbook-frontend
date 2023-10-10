import { SupplementsPicker, Typography } from '@/components/atoms';
import { toursAPI } from '@/libs/api';
import { useSupplements } from '@/libs/hooks';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { useStoreSelector } from '@/store';
import { NO_TRANSFER_ID } from '@/utils/constants';
import { CheckForEmptyHtml, selectFilterBy } from '@/utils/helpers';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Tooltip,
	message,
} from 'antd';
import { FC, Fragment, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import ReactQuill from 'react-quill';
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
		handleTerritoryChange,
		handleCountryChange,
		mutateCountries,
		mutateLocations,
		mutatePickupLocations,
		mutateStations,
		isCountriesLoading,
		isLocationsLoading,
		countries,
		locations,
	} = useInputChange(form);

	// Get Tour template data
	const { isLoading: isDataLoading, isFetching: isDataFetching } = useTTFUpdate({
		form,
		id,
		mode,
		supplementsCallback: handleAddSupplement,
		countriesCallback: mutateCountries,
		locationsCallback: mutateLocations,
		stationsCallback: mutateStations,
		pickupLocationCallback: mutatePickupLocations,
	});

	// Call all the APIs to render the form with data
	const [
		{ data: vehicles, isLoading: isVehiclesLoading },
		{ data: territories, isLoading: isTerritoriesLoading },
		{ data: fortnoxCostCenters, isLoading: isFortnoxCostCentersLoading },
		{ data: tourCategories, isLoading: isTourCategoriesLoading },
		{ data: accommodations, isLoading: isAccommodationsLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
		{ data: fortnoxProjects, isLoading: isFortnoxProjectsLoading },
		{ data: travelInfo, isLoading: isTravelInfoLoading },
		{ data: pickuplocationsList, isLoading: isPickuplocationsListLoading },
	] = useTTFData();

	// Tour template create mutation
	const { mutate: mutateCreateType, isLoading } = useMutation(
		(payload: API.TourTypeCreatePayload) => toursAPI.createType(payload),
		{
			onSuccess: () => {
				message.success(t('Tour template has been created!'));
				navigateToList();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	// Tour template update mutation
	const { mutate: mutateUpdateType, isLoading: isUpdateLoading } = useMutation(
		(payload: API.TourTypeCreatePayload) => toursAPI.updateTourType(id, payload),
		{
			onSuccess: () => {
				message.success(t('Tour template has been updated!'));
				navigateToList();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	// Call Tour template create mutation with mapped payload
	const handleSubmit = useCallback(
		(values: Omit<API.TourTypeCreatePayload, 'supplements'>) => {
			const payload: API.TourTypeCreatePayload = {
				...values,
				supplements: supplements?.map((supplement) => supplement.id) || [],
			};

			payload.tour_information = CheckForEmptyHtml(payload?.tour_information as string);

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
							{t(mode === 'update' ? 'Update tour template' : 'Create tour template')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Form
						form={form}
						size='large'
						layout='vertical'
						onFinish={handleSubmit}
						initialValues={{
							cancel_fee_percent: 0,
							travel_insurance_percent: 0,
						}}
					>
						{isDataLoading || isDataFetching ? (
							<FormSkeleton type='tourType' />
						) : (
							<Fragment>
								<Row gutter={[16, 16]}>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Name')}
											name='name'
											rules={[
												{ required: true, message: t('Please enter name of tour template!') },
											]}
										>
											<Input placeholder={t('Name of tour template')} />
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
												<Form.Item
													label={t('Territory')}
													name='territory'
													rules={[{ required: true, message: t('Territory is required!') }]}
												>
													<Select
														showSearch
														filterOption={selectFilterBy}
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
														showSearch
														filterOption={selectFilterBy}
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
												<Form.Item label={t('Location')} name='location'>
													<Select
														showSearch
														filterOption={selectFilterBy}
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
										<Form.Item label={t('Category')} name='category'>
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
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Pickup locations')} name='pickup_locations'>
											<Select
												showSearch
												filterOption={selectFilterBy}
												showArrow
												mode='multiple'
												placeholder={t('Choose an option')}
												loading={isPickuplocationsListLoading}
												options={pickuplocationsList?.results?.map(({ id, name, is_active }) =>
													id === NO_TRANSFER_ID
														? {
																value: id,
																label: t('No transfer'),
																disabled: !is_active,
														  }
														: {
																value: id,
																label: name,
																disabled: !is_active,
														  }
												)}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Travel information')} name='travel_information'>
											<Select
												showSearch
												filterOption={selectFilterBy}
												loading={isTravelInfoLoading}
												allowClear
												placeholder={t('Choose an option')}
												options={travelInfo?.results?.map(({ id, name, is_active }) => ({
													value: id,
													label: name,
													disabled: !is_active,
												}))}
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item
											label={t('Tour Information')}
											name='tour_information'
											labelCol={{ span: 24 }}
										>
											<ReactQuill theme='snow' style={{ height: '250px' }} />
										</Form.Item>
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
											disabled={
												mode === 'update' && !form.getFieldValue('is_active') ? true : false
											}
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
