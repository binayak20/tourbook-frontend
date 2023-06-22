import { Button } from '@/components/atoms';
import { publicAPI } from '@/libs/api/publicAPI';
import { LoadingOutlined } from '@ant-design/icons';
import { Col, DatePicker, Form, Row, Select } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TWidgetState, useWidgetState } from '../libs/WidgetContext';
import { useSearchOptions } from '../libs/hooks';
import { destructDestination } from '../libs/utills';

const SearchBar = () => {
	const { t } = useTranslation();
	const { state, updateState, redirects } = useWidgetState();
	const [dateFilters, setDateFilters] = useState({
		category: state?.category,
		remaining_capacity: state?.remaining_capacity,
		location: state?.location,
		country: state?.country,
	});
	const [availableDates, setAvailableDates] = useState<string[]>([]);
	const [isDatesLoading, setDatesLoading] = useState(false);
	const {
		categoriesOptions,
		remainingCapacityOptions,
		desinationsOptions,
		isLoading: isSearchCriteriaLoading,
	} = useSearchOptions();

	const disabledDates = useCallback(
		(current: moment.Moment) => !availableDates.some((date) => moment(date).isSame(current, 'day')),
		[availableDates]
	);

	const onFinish = (
		values: Omit<TWidgetState, 'departure_date'> & { departure_date: moment.Moment }
	) => {
		const { countryId, locationId } = destructDestination(values?.destination);
		updateState(
			{
				...values,
				country: countryId,
				location: locationId,
				departure_date: values.departure_date?.format('YYYY-MM-DD'),
				widget_screen: 'list',
				page: 1,
			},
			redirects?.searchURL as string
		);
	};

	useEffect(() => {
		setDatesLoading(true);
		publicAPI.availableDates(dateFilters).then((res) => {
			setAvailableDates(res.available_dates);
			setDatesLoading(false);
		});
	}, [dateFilters]);

	return (
		<Form
			onFinish={onFinish}
			initialValues={{
				...state,
				departure_date: state?.departure_date
					? moment(state.departure_date, 'YYYY-MM-DD')
					: undefined,
			}}
		>
			<Row gutter={[8, 8]} align={'bottom'}>
				<Col span={12} md={5}>
					<Form.Item name='category' label={t('Category')} labelCol={{ span: 24 }}>
						<Select
							size='large'
							options={categoriesOptions}
							loading={isSearchCriteriaLoading}
							placeholder={t('Select a category')}
							allowClear
							onChange={(value) => setDateFilters({ ...dateFilters, category: value })}
						/>
					</Form.Item>
				</Col>
				<Col span={12} md={5}>
					<Form.Item name='destination' label={t('Destination')} labelCol={{ span: 24 }}>
						<Select
							size='large'
							options={desinationsOptions}
							loading={isSearchCriteriaLoading}
							placeholder={t('Select a destination')}
							allowClear
							onChange={(value) =>
								setDateFilters({
									...dateFilters,
									location: destructDestination(value)?.locationId,
									country: destructDestination(value)?.countryId,
								})
							}
						/>
					</Form.Item>
				</Col>
				<Col span={12} md={5}>
					<Form.Item name='departure_date' label={t('Departure date')} labelCol={{ span: 24 }}>
						<DatePicker
							size='large'
							style={{ width: '100%' }}
							disabledDate={disabledDates}
							allowClear
							suffixIcon={isDatesLoading ? <LoadingOutlined spin /> : undefined}
							placeholder={t('Select a departure date')}
						/>
					</Form.Item>
				</Col>
				<Col span={12} md={5}>
					<Form.Item name='remaining_capacity' label={t('Passengers')} labelCol={{ span: 24 }}>
						<Select
							size='large'
							options={remainingCapacityOptions}
							loading={isSearchCriteriaLoading}
							placeholder={t('Select the number of passengers')}
							allowClear
							onChange={(value) => setDateFilters({ ...dateFilters, remaining_capacity: value })}
						/>
					</Form.Item>
				</Col>
				<Col span={24} md={4}>
					<Form.Item labelCol={{ span: 24 }}>
						<Button
							htmlType='submit'
							size='large'
							type='primary'
							block
							style={{ marginBottom: '0.1rem' }}
						>
							{t('Search')}
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default SearchBar;
