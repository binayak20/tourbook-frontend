import { selectFilterBy } from '@/utils/helpers';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Form as AntForm, Button, Col, Input, Row, Select, Tooltip } from 'antd';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

export interface Field {
	type: 'input' | 'select';
	name: string;
	placeholder?: string;
	options?: string[];
}

interface SearchComponentProps {
	fields: Field[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({ fields }) => {
	const [form] = AntForm.useForm();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [searchParams] = useSearchParams();

	const handleSubmit = useCallback(
		(values: any) => {
			console.log(values);
			const params = new URLSearchParams(searchParams);
			params.delete('page');
			for (const [key, value] of Object.entries(values)) {
				if (values[key]) {
					console.log(`${key}: ${value}`);
					params.set(key, value as string);
				} else {
					params.delete(values[key]);
				}
			}
			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);
	const handleReset = useCallback(() => {
		form.resetFields();
		navigate('');
	}, [form, navigate]);

	const selectOptions = (items: string[] | undefined) => {
		return (items || []).map((name) => {
			return { value: name, label: name };
		});
	};

	return (
		<Form form={form} size='large' layout='horizontal' onFinish={handleSubmit}>
			<Row gutter={12}>
				<Col style={{ width: 'calc(100% - 125px)' }}>
					<Row gutter={12}>
						{fields.map((field) => (
							<Col span={24 / fields.length} key={field.name}>
								{field.type === 'input' && (
									<Form.Item name={field.name}>
										<Input type='text' placeholder={field.placeholder} />
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
