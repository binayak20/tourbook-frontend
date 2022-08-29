import config from '@/config';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form as AntForm, Input, Row } from 'antd';
import moment from 'moment';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export const FilterBookings = () => {
	const { t } = useTranslation();
	const [form] = AntForm.useForm();
	const navigate = useNavigate();

	const handleReset = useCallback(() => {
		form.resetFields();
		navigate('');
	}, [form, navigate]);

	const handleSubmit = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(values: any = {}) => {
			const params = new URLSearchParams();
			if (values.name) {
				params.append('name', values.name);
			}
			if (values.ref) {
				params.append('ref', values.ref);
			}
			if (values.date?.length === 2) {
				params.append('departure_date', moment(values.date[0]).format(config.dateFormat));
				params.append('return_date', moment(values.date[1]).format(config.dateFormat));
			}

			const search = params.toString();
			if (search) {
				navigate(`?${search}`);
			} else {
				navigate('');
			}
		},
		[navigate]
	);

	return (
		<Form form={form} size='large' layout='vertical' onFinish={(values) => handleSubmit(values)}>
			<Row gutter={12}>
				<Col span={6}>
					<Form.Item name='name'>
						<Input placeholder={t('Name')} />
					</Form.Item>
				</Col>
				<Col span={6}>
					<Form.Item name='ref'>
						<Input placeholder={t('Ref.')} />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item name='date'>
						<DatePicker.RangePicker
							placeholder={[t('Departure date'), t('Return date')]}
							style={{ width: '100%' }}
						/>
					</Form.Item>
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
