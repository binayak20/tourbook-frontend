import { Button, SupplementsPicker, Typography } from '@/components/atoms';
import config from '@/config';
import { toursAPI } from '@/libs/api';
import { useSupplements } from '@/libs/hooks';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { useStoreSelector } from '@/store';
import { BOOKING_FEE_PERCENT } from '@/utils/constants';
import { InfoCircleOutlined } from '@ant-design/icons';
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
	Tooltip,
} from 'antd';
import moment from 'moment';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FormSkeleton } from './FormSkeleton';
import { useInputChange } from './hooks/useInputChange';
import { useTFData } from './hooks/useTFData';
import { useTFUpdate } from './hooks/useTFUpdate';
import { useTourTypeChange } from './hooks/useTourTypeChange';
import { useTTFData } from './hooks/useTTFData';

type TourUpdateProps = {
	mode?: 'create' | 'update';
};

export const TourCreate: FC<TourUpdateProps> = ({ mode = 'create' }) => {
	const [isReserved, setReserved] = useState(false);
	const [isRepeat, setRepeat] = useState(false);
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const { id } = useParams() as unknown as { id: number };
	const { currencyID } = useStoreSelector((state) => state.app);

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
			booking_fee_percent: BOOKING_FEE_PERCENT,
		});
	}, [form]);

	const navigateToList = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.TOURS}`);
	}, [navigate]);

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
		reservedCallback: setReserved,
		repeatCallback: setRepeat,
	});

	// Call all the APIs to render the form with data
	const [
		{ data: tourTypes, isLoading: isTourTypesLoading },
		{ data: tourTags, isLoading: isTagsLoading },
	] = useTFData();

	const [
		{ data: vehicles, isLoading: isVehiclesLoading },
		{ data: territories, isLoading: isTerritoriesLoading },
		{ data: fortnoxCostCenters, isLoading: isFortnoxCostCentersLoading },
		{ data: tourCategories, isLoading: isTourCategoriesLoading },
		{ data: accommodations, isLoading: isAccommodationsLoading },
		{ data: currencies, isLoading: isCurrenciesLoading },
		{ data: stationsTypes, isLoading: isStationsTypesLoading },
	] = useTTFData();

	// Get next calendar date based on capacity and departure date
	const getNextCalendarDate = useCallback(() => {
		const { departure_date, duration } = form.getFieldsValue();
		const departureDate = moment(departure_date, 'DD-MM-YYYY');
		const nextDate = departureDate.clone().add(duration - 1, 'days');
		if (departure_date && duration) {
			form.setFieldsValue({ return_date: nextDate });
		}
	}, [form]);

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
		(values: Omit<API.TourCreatePayload, 'supplements'>) => {
			const payload: API.TourCreatePayload = {
				...values,
				supplements: supplements?.map((supplement) => supplement.id) || [],
			};

			if (values.departure_date) {
				payload.departure_date = moment(values.departure_date).format(config.dateFormat);
			}

			if (values.return_date) {
				payload.return_date = moment(values.return_date).format(config.dateFormat);
			}

			if (values.reservation_expiry_date) {
				payload.reservation_expiry_date = moment(values.reservation_expiry_date).format(
					config.dateFormat
				);
			}

			if (id && mode === 'update') {
				mutateUpdateTour(payload);
			} else {
				mutateCreateTour(payload);
			}
		},
		[id, mode, mutateCreateTour, mutateUpdateTour, supplements]
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
									<Col span={24}>
										<Row>
											<Col xl={12} xxl={8}>
												<Form.Item
													label={t('Tour type')}
													name='tour_type'
													style={{ fontWeight: 'bold' }}
													help={
														mode === 'create' && (
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
																	'You can create a new tour by selecting the available tour type or use the form if you want to create a separate one'
																)}
															</Typography.Paragraph>
														)
													}
												>
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
										</Row>
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
											<InputNumber
												style={{ width: '100%' }}
												min={0}
												onChange={getNextCalendarDate}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={t('Departure date')}
											name='departure_date'
											rules={[{ required: true, message: t('Departure date is required!') }]}
										>
											<DatePicker
												style={{ width: '100%' }}
												showToday={false}
												onChange={getNextCalendarDate}
											/>
										</Form.Item>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item
											label={
												<Row>
													<Col span='auto'>{t('Return date')}</Col>
													<Col>
														<Tooltip
															title={t(
																'This date will be calculated based on duration and departure date'
															)}
															overlayInnerStyle={{ fontSize: 12, lineHeight: '16px' }}
														>
															<InfoCircleOutlined
																style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.45)' }}
															/>
														</Tooltip>
													</Col>
												</Row>
											}
											name='return_date'
										>
											<DatePicker style={{ width: '100%' }} showToday={false} disabled />
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
														// eslint-disable-next-line @typescript-eslint/ban-ts-comment
														// @ts-ignore
														autoComplete={'chrome-off'}
													/>
												</Form.Item>
											</Col>
										</Row>
									</Col>
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Tour tag')} name='tour_tag'>
											<Select
												showArrow
												placeholder={t('Choose an option')}
												loading={isTagsLoading}
												options={tourTags?.results?.map(({ id, code }) => ({
													value: id,
													label: code,
												}))}
											/>
										</Form.Item>
									</Col>
								</Row>

								<Divider />

								<FormItemSwitch
									label={t('Reserve tour capacity')}
									name='is_reserved'
									valuePropName='checked'
								>
									<Switch onChange={(e) => setReserved(e)} />
								</FormItemSwitch>

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

								<FormItemSwitch label={t('Repeat tour')} name='is_repeat' valuePropName='checked'>
									<Switch onChange={(e) => setRepeat(e)} />
								</FormItemSwitch>

								{isRepeat && (
									<Row gutter={16}>
										<Col xl={8}>
											<Form.Item
												label={t('Each')}
												name='repeat_interval'
												rules={[{ required: true, message: t('Reserve seats is required!') }]}
											>
												<InputNumber
													style={{ width: '100%' }}
													placeholder={t('Duration between repeats')}
													min={0}
												/>
											</Form.Item>
										</Col>
										<Col xl={8}>
											<Form.Item
												label={t('Repeat type')}
												name='repeat_type'
												rules={[{ required: true, message: t('Repeat type is required') }]}
											>
												<Select
													placeholder={t('Weeks or Months')}
													options={[
														{ label: 'Weeks', value: 'weeks' },
														{ label: 'Months', value: 'months' },
													]}
												/>
											</Form.Item>
										</Col>
										<Col xl={8}>
											<Form.Item
												label={t('Repeat for')}
												name='repeat_for'
												rules={[{ required: true, message: t('Repeat for is required') }]}
											>
												<InputNumber
													style={{ width: '100%' }}
													placeholder={t('Number of repeats')}
													min={0}
												/>
											</Form.Item>
										</Col>
									</Row>
								)}

								<FormItemSwitch
									label={t('Do you want to make it private?')}
									name='is_private'
									valuePropName='checked'
								>
									<Switch />
								</FormItemSwitch>

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

const FormItemSwitch = styled(Form.Item)`
	.ant-form-item-control-input {
		min-height: auto;
	}
`;
