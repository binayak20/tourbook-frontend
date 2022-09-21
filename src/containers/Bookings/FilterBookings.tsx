import config from '@/config';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form as AntForm, Input, Row } from 'antd';
import moment from 'moment';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

type FormValues = {
	booking_name?: string;
	booking_reference?: string;
	departure_date?: string;
};

export const FilterBookings = () => {
	const { t } = useTranslation();
	const [form] = AntForm.useForm();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		form.setFieldsValue({
			booking_name: searchParams.get('booking_name'),
			booking_reference: searchParams.get('booking_reference'),
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
			const params = new URLSearchParams();

			if (values.booking_name) {
				params.append('booking_name', values.booking_name);
			}
			if (values.booking_reference) {
				params.append('booking_reference', values.booking_reference);
			}
			if (values.departure_date) {
				params.append('departure_date', moment(values.departure_date).format(config.dateFormat));
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
			onFinish={(values) => handleSubmit(values as FormValues)}
		>
			<Row gutter={12}>
				<Col style={{ width: 'calc(100% - 125px)' }}>
					<Row gutter={12}>
						<Col span={8}>
							<Form.Item name='booking_name'>
								<Input placeholder={t('Booking name')} />
							</Form.Item>
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
