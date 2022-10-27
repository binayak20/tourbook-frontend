/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@/config';
import { locationsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { selectFilterBy } from '@/utils/helpers';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form as AntForm, Row, Select, Tooltip } from 'antd';
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
			location: parseInt(searchParams.get('location') || '') || undefined,
			departure_date: searchParams.get('departure_date')
				? moment(searchParams.get('departure_date'), config.dateFormat)
				: undefined,
		});
	}, [form, searchParams]);

	const handleSubmit = useCallback(
		(values: any) => {
			const params = new URLSearchParams();

			if (values.location) {
				params.append('location', values.location);
			}
			if (values.departure_date) {
				params.append('departure_date', moment(values.departure_date).format(config.dateFormat));
			}

			const searchStr = params.toString();
			navigate(searchStr ? `?${searchStr}` : '');
		},
		[navigate]
	);

	const handleReset = useCallback(() => {
		form.resetFields();
		navigate('');
	}, [form, navigate]);

	return (
		<Form form={form} size='large' layout='vertical' onFinish={handleSubmit}>
			<Row gutter={12}>
				<Col style={{ width: 'calc(100% - 125px)' }}>
					<Row gutter={12}>
						<Col span={8}>
							<Form.Item name='location'>
								<Select
									showSearch
									options={locationsOptions}
									loading={locationsLoading}
									placeholder={t('Locations')}
									filterOption={selectFilterBy}
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='departure_date'>
								<DatePicker placeholder={t('Departure date')} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={8}></Col>
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
