/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { selectFilterBy } from '@/utils/helpers';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
	Button,
	Col,
	DatePicker,
	Form as AntForm,
	Input,
	Row,
	Select,
	Switch,
	Tooltip,
} from 'antd';
import moment from 'moment';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

export const FilterTable = () => {
	const { t } = useTranslation();
	const [form] = AntForm.useForm();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { RangePicker } = DatePicker;

	const [{ data: locations, isLoading: locationsLoading }] = useQueries([
		{
			queryKey: ['locations'],
			queryFn: () => locationsAPI.list(DEFAULT_LIST_PARAMS),
		},
	]);

	const locationsOptions = useMemo(() => {
		return (locations?.results || []).map(({ id, name }) => {
			return { value: id, label: name };
		});
	}, [locations]);

	useEffect(() => {
		form.setFieldsValue({
			remaining_capacity: searchParams.get('remaining_capacity') || null,
			location: parseInt(searchParams.get('location') || '') || undefined,
			name: searchParams.get('name') || undefined,
			departure_dates:
				searchParams.get('from_departure_date') && searchParams.get('to_departure_date')
					? [
							moment(searchParams.get('from_departure_date'), config.dateFormat),
							moment(searchParams.get('to_departure_date'), config.dateFormat),
					  ]
					: undefined,
		});
	}, [form, searchParams]);

	const handleSubmit = useCallback(
		(values: any) => {
			console.log(values);
			const params = new URLSearchParams(searchParams);

			if (values.location) {
				params.set('location', values.location);
			} else {
				params.delete('location');
			}
			if (values.departure_dates) {
				params.set('from_departure_date', values.departure_dates[0].format(config.dateFormat));
				params.set('to_departure_date', values.departure_dates[1].format(config.dateFormat));
			} else {
				params.delete('from_departure_date');
				params.delete('to_departure_date');
			}
			if (values.name) {
				params.set('name', values.name);
			} else {
				params.delete('name');
			}
			if (values.remaining_capacity) {
				params.set('remaining_capacity', '1');
			} else {
				params.delete('remaining_capacity');
			}

			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	const handleReset = useCallback(() => {
		form.resetFields();
		navigate('');
	}, [form, navigate]);

	return (
		<Form form={form} size='large' layout='horizontal' onFinish={handleSubmit}>
			<Row gutter={12}>
				<Col style={{ width: 'calc(100% - 125px)' }}>
					<Row gutter={12}>
						<Col span={6}>
							<Form.Item name='name'>
								<Input placeholder={t('Name')} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='location'>
								<Select
									showSearch
									allowClear
									options={locationsOptions}
									loading={locationsLoading}
									placeholder={t('Locations')}
									filterOption={selectFilterBy}
									onChange={() => {
										handleSubmit(form.getFieldsValue());
									}}
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='departure_dates'>
								<RangePicker
									style={{ width: '100%' }}
									placeholder={[t('Departure from'), t('Departure to')]}
									size='large'
									onChange={() => {
										handleSubmit(form.getFieldsValue());
									}}
									allowClear
								/>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item
								name='remaining_capacity'
								label={<span style={{ padding: '7px 0 0 0' }}>{t('Filter by capacity')}: </span>}
								colon={false}
							>
								<Switch
									checked={searchParams.get('remaining_capacity') ? true : false}
									onChange={() => handleSubmit(form.getFieldsValue())}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Col>
				<Col>
					<Tooltip title={t('Search')} placement='bottom'>
						<Button ghost type='primary' htmlType='submit'>
							<SearchOutlined />
						</Button>
					</Tooltip>
					<Tooltip title={t('Reset')} placement='bottom'>
						<Button ghost type='primary' style={{ marginLeft: 12 }} onClick={handleReset}>
							<ReloadOutlined />
						</Button>
					</Tooltip>
				</Col>
			</Row>
		</Form>
	);
};

const Form = styled(AntForm)`
	.ant {
		&-form {
			&-item {
				margin-bottom: 0;
			}
		}
	}
`;
