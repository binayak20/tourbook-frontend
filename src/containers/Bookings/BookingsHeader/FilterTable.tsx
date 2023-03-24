import config from '@/config';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form as AntForm, Input, Row, Tooltip } from 'antd';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

type FormValues = {
	booking_name?: string;
	reference?: string;
	departure_date?: string;
};

export const FilterTable = () => {
	const { t } = useTranslation();
	const [form] = AntForm.useForm();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		form.setFieldsValue({
			booking_name: searchParams.get('booking_name'),
			booking_reference: searchParams.get('reference'),
			departure_date: searchParams.get('departure_date')
				? moment(searchParams.get('departure_date'), config.dateFormat)
				: undefined,
		});
	}, [form, searchParams]);

	const handleReset = useCallback(() => {
		form.resetFields();
		navigate('');
	}, [form, navigate]);

	const handleSubmit = useCallback(
		(values: FormValues) => {
			const params = new URLSearchParams(searchParams);

			if (values.booking_name) {
				params.set('booking_name', values.booking_name);
			} else {
				params.delete('booking_name');
			}
			if (values.reference) {
				params.set('reference', values.reference);
			} else {
				params.delete('reference');
			}
			if (values.departure_date) {
				params.set('departure_date', moment(values.departure_date).format(config.dateFormat));
			} else {
				params.delete('departure_date');
			}

			navigate({ search: params.toString() });
		},
		[navigate, searchParams]
	);

	return (
		<Form
			form={form}
			size='large'
			layout='vertical'
			onFinish={(values) => handleSubmit(values as FormValues)}
		>
			<Row gutter={12}>
				<Col style={{ width: 'calc(100% - 125px)' }}>
					<Row gutter={12}>
						<Col span={8}>
							<Tooltip placement='top' title={t('search only with primary passenger name')}>
								<Form.Item name='booking_name'>
									<Input placeholder={t('Passenger name')} />
								</Form.Item>
							</Tooltip>
						</Col>
						<Col span={8}>
							<Form.Item name='reference'>
								<Input placeholder={t('Booking reference')} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='departure_date'>
								<DatePicker placeholder={t('Departure date')} style={{ width: '100%' }} />
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
