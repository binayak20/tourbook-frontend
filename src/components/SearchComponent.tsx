import config from '@/config';
import { selectFilterBy } from '@/utils/helpers';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
	Form as AntForm,
	Button,
	Col,
	DatePicker,
	Input,
	Row,
	Select,
	Switch,
	Tooltip,
} from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const { RangePicker } = DatePicker;

export interface FieldOption {
	value: string | number;
	label: string;
}
export interface Field {
	type: 'input' | 'select' | 'date-range' | 'switch';
	name: string;
	placeholder?: string[] | string;
	options?: FieldOption[];
	param?: string[] | string | undefined;
	value?: boolean | string | number;
	defaultValue?: undefined | null;
}

interface SearchComponentProps {
	fields: Field[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({ fields }) => {
	const [form] = AntForm.useForm();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const queryParams: Record<string, any> = {};
		// Loop through fieldMappings and set the values from searchParams
		fields.forEach(({ name, param, type, defaultValue }) => {
			let paramValue;
			if (Array.isArray(param)) {
				const [fromParam, toParam] = param;
				const fromValue = searchParams.get(fromParam);
				const toValue = searchParams.get(toParam);
				if (fromValue && toValue) {
					paramValue = [moment(fromValue, config.dateFormat), moment(toValue, config.dateFormat)];
				}
			} else {
				let paramStringValue: number | string | null;
				if (type === 'select') {
					paramStringValue = Number(searchParams.get(param as string));
				} else {
					paramStringValue = searchParams.get(param as string);
				}
				paramValue = paramStringValue ? paramStringValue : defaultValue;
			}
			queryParams[name] = paramValue !== null ? paramValue : defaultValue;
		});

		form.setFieldsValue(queryParams);
	}, [form, searchParams, fields]);

	const handleSubmit = useCallback(
		(values: any) => {
			const params = new URLSearchParams(searchParams);
			params.delete('page');
			for (const field of fields) {
				const key = field.name;
				const value = values[key];

				if (field.type === 'date-range') {
					const [fromDateFieldName, toDateFieldName] = field.param || [];
					const dateRange = values[field.name];
					if (Array.isArray(dateRange) && dateRange.length === 2) {
						params.set(fromDateFieldName, dateRange[0].format(config.dateFormat));
						params.set(toDateFieldName, dateRange[1].format(config.dateFormat));
					}
				}
				if (field.type === 'switch' && field.value !== undefined && value === true) {
					params.set(key, field.value.toString());
				}
				if (field.type === 'switch' && field.value !== undefined && value === false) {
					params.delete(key);
				}
				if (field.type === 'input' && value) {
					params.set(key, value);
				}
				if (field.type === 'select' && value) {
					params.set(key, value);
				}
			}
			navigate({ search: params.toString() });
		},
		[navigate, searchParams, fields]
	);

	const handleReset = useCallback(() => {
		form.resetFields();
		navigate('');
	}, [form, navigate]);

	function selectOptions(options: FieldOption[] = []) {
		return options.map((option) => ({
			value: option.value,
			label: option.label,
		}));
	}

	return (
		<Form form={form} size='large' layout='horizontal' onFinish={handleSubmit}>
			<Row gutter={12}>
				<Col style={{ width: 'calc(100% - 125px)' }}>
					<Row gutter={12}>
						{fields.map((field) => (
							<Col span={24 / fields.length} key={field.name}>
								{field.type === 'input' && (
									<Form.Item name={field.name}>
										<Input type='text' placeholder={field.placeholder as string} />
									</Form.Item>
								)}
								{field.type === 'select' && (
									<Form.Item name={field.name}>
										<Select
											showSearch
											allowClear
											options={selectOptions(field.options)}
											placeholder={field.placeholder}
											filterOption={selectFilterBy}
											//	onChange={() => handleSubmit(form.getFieldsValue())}
										/>
									</Form.Item>
								)}
								{field.type === 'date-range' && (
									<Form.Item name={field.name}>
										<RangePicker
											format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
											style={{ width: '100%' }}
											placeholder={
												field.placeholder
													? [field.placeholder[0] as string, field.placeholder[1]]
													: undefined
											}
											size='large'
											allowClear
										/>
									</Form.Item>
								)}
								{field.type === 'switch' && (
									<Form.Item
										name={field.name}
										label={<span style={{ padding: '7px 0 0 0' }}>{field.placeholder}: </span>}
										colon={false}
									>
										<Switch
											checked={searchParams.get(field.name) ? true : false}
											onChange={() => handleSubmit(form.getFieldsValue())}
										/>
									</Form.Item>
								)}
							</Col>
						))}
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

export default SearchComponent;

const Form = styled(AntForm)`
	.ant {
		&-form {
			&-item {
				margin-bottom: 0;
			}
		}
	}
`;
