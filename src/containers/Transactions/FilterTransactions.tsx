import { paymentConfigsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form as AntForm, Input, Row, Select } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const TRANSACTION_STATUS = [
	{ value: 'pending', label: 'Pending' },
	{ value: 'paid', label: 'Paid' },
];

export const FilterTransactions = () => {
	const { t } = useTranslation();
	const [form] = AntForm.useForm<API.TransactionsParams>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [{ data: paymentConfigurations }] = useQueries([
		{
			queryKey: ['paymentConfigurations'],
			queryFn: () => paymentConfigsAPI.paymentConfigurations(DEFAULT_LIST_PARAMS),
		},
	]);

	const paymentMethodOptions = useMemo(() => {
		return (paymentConfigurations?.results || []).map((config) => {
			return { value: config.id, label: config.payment_method.name };
		});
	}, [paymentConfigurations]);

	useEffect(() => {
		form.setFieldsValue({
			name: searchParams.get('name') || undefined,
			status: searchParams.get('status') || undefined,
			payment_method: searchParams.get('payment_method') || undefined,
		});
	}, [form, searchParams, paymentMethodOptions]);

	const handleReset = useCallback(() => {
		form.resetFields();
		navigate('');
	}, [form, navigate]);

	const handleSubmit = useCallback(
		(values: API.TransactionsParams) => {
			const params = new URLSearchParams();

			if (values.name) {
				params.append('name', values.name);
			}
			if (values.status) {
				params.append('status', values.status);
			}
			if (values.payment_method) {
				params.append('payment_method', values.payment_method);
			}

			const searchStr = params.toString();
			navigate(searchStr ? `?${searchStr}` : '');
		},
		[navigate]
	);

	return (
		<Form
			form={form}
			size='large'
			layout='vertical'
			onFinish={(values) => handleSubmit(values as API.TransactionsParams)}
		>
			<Row gutter={12}>
				<Col style={{ width: 'calc(100% - 125px)' }}>
					<Row gutter={12}>
						<Col span={8}>
							<Form.Item name='name'>
								<Input placeholder={t('Search...')} prefix={<SearchOutlined />} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='status'>
								<Select options={TRANSACTION_STATUS} placeholder={t('Status')} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='payment_method'>
								<Select options={paymentMethodOptions} placeholder={t('Payment method')} />
							</Form.Item>
						</Col>
					</Row>
				</Col>
				<Col>
					<Button ghost type='primary' htmlType='submit'>
						<SearchOutlined />
					</Button>
					<Button ghost type='primary' style={{ marginLeft: 12 }} onClick={handleReset}>
						<ReloadOutlined />
					</Button>
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
