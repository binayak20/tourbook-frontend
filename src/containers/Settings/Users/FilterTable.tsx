/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from '@/components/atoms';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Form as AntForm, Button, Col, Input, Row, Tooltip, Typography } from 'antd';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

export const FilterTable = () => {
	const { t } = useTranslation();
	const [form] = AntForm.useForm();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		form.setFieldsValue({
			email: searchParams.get('email'),
			name: searchParams.get('name'),
			is_passenger: searchParams.get('is_passenger') === 'true',
		});
	}, [form, searchParams]);

	const handleSubmit = useCallback(
		(values: any) => {
			const params = new URLSearchParams();

			if (values.email) {
				params.append('email', values.email);
			}
			if (values.name) {
				params.append('name', values.name);
			}
			if (values.is_passenger) {
				params.set('is_passenger', values.is_passenger.toString());
			} else {
				params.delete('is_passenger');
				//params.set('is_passenger', values.is_passenger.toString());
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
							<Form.Item name='email'>
								<Input type='email' placeholder={t('Search by email')} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='name'>
								<Input type='text' placeholder={t('Search by name')} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Row align='middle' gutter={12}>
								<Col>
									<Form.Item name='is_passenger' valuePropName='checked'>
										<Switch
											checked={searchParams.get('is_passenger') ? true : false}
											onChange={() => handleSubmit(form.getFieldsValue() || 'false')}
											custom
											checkedChildren={t('Yes')}
											unCheckedChildren={t('No')}
										/>
									</Form.Item>
								</Col>
								<Col>
									<Typography.Text>{t('Passenger')}</Typography.Text>
								</Col>
							</Row>
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
