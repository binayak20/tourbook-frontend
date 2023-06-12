import { Button } from '@/components/atoms';
import { publicAPI } from '@/libs/api/publicAPI';
import { Col, DatePicker, Form, Row, Select } from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { TWidgetState, useWidgetState } from '../libs/WidgetContext';
import { useSearchOptions } from '../libs/hooks';

const SearchBar = () => {
	const { state, updateState } = useWidgetState();
	const [availableDates, setAvailableDates] = useState<string[]>([]);
	const {
		categoriesOptions,
		countriesOptions,
		remainingCapacityOptions,
		isLoading: isSearchCriteriaLoading,
	} = useSearchOptions();

	const disabledDates = useCallback(
		(current: moment.Moment) => !availableDates.some((date) => moment(date).isSame(current, 'day')),
		[availableDates]
	);

	const onFinish = (
		values: Omit<TWidgetState, 'departure_date'> & { departure_date: moment.Moment }
	) => {
		updateState({
			...values,
			departure_date: values.departure_date?.format('YYYY-MM-DD'),
			widget_screen: 'list',
			page: 1,
		});
	};

	useEffect(() => {
		publicAPI.availableDates().then((res) => {
			setAvailableDates(res.available_dates);
		});
	}, []);

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
					<Form.Item name='tour_type' label='Type' labelCol={{ span: 24 }}>
						<Select
							size='large'
							options={categoriesOptions}
							loading={isSearchCriteriaLoading}
							placeholder='Select type'
							allowClear
						/>
					</Form.Item>
				</Col>
				<Col span={12} md={5}>
					<Form.Item name='country' label='Destination' labelCol={{ span: 24 }}>
						<Select
							size='large'
							options={countriesOptions}
							loading={isSearchCriteriaLoading}
							placeholder='Select destination'
							allowClear
						/>
					</Form.Item>
				</Col>
				<Col span={12} md={5}>
					<Form.Item name='departure_date' label='Departure Date' labelCol={{ span: 24 }}>
						<DatePicker size='large' style={{ width: '100%' }} disabledDate={disabledDates} />
					</Form.Item>
				</Col>
				<Col span={12} md={5}>
					<Form.Item name='remaining_capacity' label='Passengers' labelCol={{ span: 24 }}>
						<Select
							size='large'
							options={remainingCapacityOptions}
							loading={isSearchCriteriaLoading}
							placeholder='Select number of travellers'
							allowClear
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
							Search
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default SearchBar;
