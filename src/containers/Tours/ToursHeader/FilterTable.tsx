/* eslint-disable @typescript-eslint/no-explicit-any */
import { locationsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

import SearchComponent, { Field } from '../../../components/SearchComponent';

export const FilterTable = () => {
	const { t } = useTranslation();

	const [{ data: locations }] = useQueries([
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

	// useEffect(() => {
	// 	form.setFieldsValue({
	// 		remaining_capacity: searchParams.get('remaining_capacity') || null,
	// 		location: parseInt(searchParams.get('location') || '') || undefined,
	// 		name: searchParams.get('name') || undefined,
	// 		departure_dates:
	// 			searchParams.get('from_departure_date') && searchParams.get('to_departure_date')
	// 				? [
	// 						moment(searchParams.get('from_departure_date'), config.dateFormat),
	// 						moment(searchParams.get('to_departure_date'), config.dateFormat),
	// 				  ]
	// 				: undefined,
	// 	});
	// }, [form, searchParams]);

	// const handleSubmit = useCallback(
	// 	(values: any) => {
	// 		console.log(values);
	// 		const params = new URLSearchParams(searchParams);
	// 		params.delete('page');

	// 		if (values.location) {
	// 			params.set('location', values.location);
	// 		} else {
	// 			params.delete('location');
	// 		}
	// 		if (values.departure_dates) {
	// 			params.set('from_departure_date', values.departure_dates[0].format(config.dateFormat));
	// 			params.set('to_departure_date', values.departure_dates[1].format(config.dateFormat));
	// 		} else {
	// 			params.delete('from_departure_date');
	// 			params.delete('to_departure_date');
	// 		}
	// 		if (values.name) {
	// 			params.set('name', values.name);
	// 		} else {
	// 			params.delete('name');
	// 		}
	// 		if (values.remaining_capacity) {
	// 			params.set('remaining_capacity', '1');
	// 		} else {
	// 			params.delete('remaining_capacity');
	// 		}

	// 		navigate({ search: params.toString() });
	// 	},
	// 	[navigate, searchParams]
	// );

	// const handleReset = useCallback(() => {
	// 	form.resetFields();
	// 	navigate('');
	// }, [form, navigate]);

	const searchFields: Field[] = [
		{ type: 'input', name: 'name', placeholder: t('Search by name') },
		{
			type: 'select',
			name: 'location',
			placeholder: t('Locations'),
			options: locationsOptions,
		},
		{
			type: 'date-range',
			name: 'departure_dates',
			dateFields: ['from_departure_date', 'to_departure_date'],
			//placeholder: [t('Departure from'), t('Departure to')],
			//	options: locationsOptions,
		},
		{
			type: 'switch',
			name: 'remaining_capacity',
			value: '1',
			placeholder: t('Filter by capacity'),
			//	options: locationsOptions,
		},
	];

	return (
		<>
			{/* <Form form={form} size='large' layout='horizontal' onFinish={handleSubmit}>
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
										format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
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
			</Form> */}
			<SearchComponent fields={searchFields} />
		</>
	);
};

// const Form = styled(AntForm)`
// 	.ant {
// 		&-form {
// 			&-item {
// 				margin-bottom: 0;
// 			}
// 		}
// 	}
// `;
