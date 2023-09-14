/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Form as AntForm, Button, Col, Input, Row, Tooltip } from 'antd';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

export const FilterTable = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [form] = AntForm.useForm();

	useEffect(() => {
		form.setFieldsValue({
			name: searchParams.get('name') || undefined,
		});
	}, [form, searchParams]);

	const handleSubmit = useCallback(
		(values: any) => {
			const params = new URLSearchParams(searchParams);
			params.delete('page');
			if (values.name) {
				params.set('name', values.name);
			} else {
				params.delete('name');
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
		<Form form={form} size='large' layout='vertical' onFinish={handleSubmit}>
			<Row gutter={12}>
				<Col style={{ width: 'calc(100% - 125px)' }}>
					<Row gutter={12}>
						<Col span={6}>
							<Form.Item name='name'>
								<Input placeholder={t('Name')} />
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
