import { Button, SupplementsPicker, Typography } from '@/components/atoms';
import TourRepeat from '@/components/atoms/TourRepeat';
import config from '@/config';
import { toursAPI } from '@/libs/api';

import { useSupplements } from '@/libs/hooks';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { useStoreSelector } from '@/store';

import { CheckForEmptyHtml, selectFilterBy } from '@/utils/helpers';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
	Card,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	Row,
	Select,
	Switch,
	Tooltip,
	message,
} from 'antd';
import moment from 'moment';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FormSkeleton } from './FormSkeleton';
import TourBookingList from './TourBookingList';
import UploadTourImage from './UploadTourImage';
import { useInputChange } from './hooks/useInputChange';
import { useTFData } from './hooks/useTFData';
import { useTFUpdate } from './hooks/useTFUpdate';
import { useTTFData } from './hooks/useTTFData';
import { useTourTypeChange } from './hooks/useTourTypeChange';

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
	const { currencyID, minBookingFee } = useStoreSelector((state) => state.app);

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
		handleClearList,
		refetchSupplements,
		handleUpdateSupplementPrice,
	} = useSupplements();

	// Input chnage mutations
	const {
		handleTerritoryChange,
		handleCountryChange,
		mutateCountries,
		mutateLocations,
		mutateStations,
		mutatePickupLocations,
		isCountriesLoading,
		isLocationsLoading,
		countries,
		locations,
	} = useInputChange(form);

	// Get Tour template data
	const { isLoading: isDataLoading, isFetching: isDataFetching } = useTFUpdate({
		form,
		id,
		mode,
		supplementsCallback: handleAddSupplement,
		countriesCallback: mutateCountries,
		locationsCallback: mutateLocations,
		stationsCallback: mutateStations,
		reservedCallback: setReserved,
		pickupLocationCallback: mutatePickupLocations,
	});

	// Tour template change mutation
	const { mutate: mutateTourType } = useTourTypeChange({
		form,
		pickupLocationCallback: mutatePickupLocations,
		supplementsCallback: handleAddSupplement,
		supplementsClearCallback: handleClearSupplements,
		countriesCallback: mutateCountries,
		locationsCallback: mutateLocations,
		stationsCallback: mutateStations,
		reservedCallback: setReserved,
		repeatCallback: setRepeat,
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
		{ data: fortnoxProjects, isLoading: isFortnoxProjectsLoading },
		{ data: travelInfo, isLoading: isTravelInfoLoading },
		{ data: pickUplocationList, isLoading: isPickupLoactionsListLoading },
		{ data: tourTagList, isLoading: isTourTagListLoading },
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
		(values: Omit<API.TourCreatePayload, 'supplements'> & { repeat_departure_dates: number[] }) => {
			const payload: API.TourCreatePayload = {
				...values,
				supplements: supplements?.map(({ id, price }) => ({ supplement: id, price })) || [],
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

			if (values?.repeat_departure_dates?.length) {
				payload.repeat_with_date_intervals = values?.repeat_departure_dates.map((val) => ({
					departure_date: moment(val)?.format('YYYY-MM-DD'),
				}));
			}

			payload.tour_information = CheckForEmptyHtml(payload?.tour_information as string);

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
													label={t('Tour template')}
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
																	'You can create a new tour by selecting the available tour templates or use the form if you want to create a separate one'
																)}
															</Typography.Paragraph>
														)
													}
												>
													<Select
														showSearch
														filterOption={selectFilterBy}
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
											rules={[
												{ required: true, message: t('Please enter name of tour template!') },
											]}
										>
											<Input placeholder={t('Name of tour')} />
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
												format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
												placeholder={t('Select date')}
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
											<DatePicker
												format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
												placeholder={t('Select date')}
												style={{ width: '100%' }}
												showToday={false}
												disabled
											/>
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
											label={t('Standard price (base)')}
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
											label={t('Transport cost')}
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
												loading={isPickupLoactionsListLoading}
												options={pickUplocationList?.results?.map(({ id, name, is_active }) => ({
													value: id,
													label: name,
													disabled: !is_active,
												}))}
											/>
										</Form.Item>
									</Col>
									{mode === 'update' ? (
										<Col span={24}>
											<Form.Item label={t('Tour Images')}>
												<UploadTourImage form={form} />
											</Form.Item>
										</Col>
									) : null}
									<Col xl={12} xxl={8}>
										<Form.Item label={t('Tour Tag')} name='tour_tag'>
											<Select
												showSearch
												filterOption={selectFilterBy}
												loading={isTourTagListLoading}
												allowClear
												placeholder={t('Choose an option')}
												options={tourTagList?.results?.map(({ id, name, is_active }) => ({
													value: id,
													label: name,
													disabled: !is_active,
												}))}
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
												<DatePicker
													format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
													placeholder={t('Select date')}
													style={{ width: '100%' }}
													showToday={false}
												/>
											</Form.Item>
										</Col>
									</Row>
								)}

								<FormItemSwitch label={t('Repeat tour')} name='is_repeat' valuePropName='checked'>
									<Switch onChange={(e) => setRepeat(e)} />
								</FormItemSwitch>
								{isRepeat && <TourRepeat form={form} />}
								<FormItemSwitch
									label={
										<>
											<span style={{ marginRight: '10px' }}>
												{t('Do you want to make it private?')}
											</span>
											<Tooltip
												style={{ paddingLeft: '40px' }}
												placement='top'
												title={t('It will not be published on the website')}
											>
												<InfoCircleOutlined />
											</Tooltip>
										</>
									}
									name='is_private'
									valuePropName='checked'
								>
									<Switch />
								</FormItemSwitch>

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
									onUpdateSupplementPrice={handleUpdateSupplementPrice}
								/>
								{mode === 'update' && <TourBookingList Id={id} />}
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
											disabled={
												mode === 'update' && !form.getFieldValue('is_active') ? true : false
											}
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
