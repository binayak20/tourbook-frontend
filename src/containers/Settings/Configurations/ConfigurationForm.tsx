import { Button } from '@/components/atoms';
import { Col, Form, FormInstance, Input, Row } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import UploadConfigFile from './UploadConfigFile';

type Props = {
	form: FormInstance;
	saveButtonText?: string;
	isLoading?: boolean;
};

export const ConfigurationForm: FC<Props> = ({ form, saveButtonText, isLoading }) => {
	const { t } = useTranslation();

	return (
		<>
			<Row gutter={40}>
				<Col lg={12} xl={8}>
					<Form.Item name='logo' label={t('Logo')}>
						<UploadConfigFile form={form} fieldName='logo' />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item name='favicon' label={t('Favicon')}>
						<UploadConfigFile form={form} fieldName='favicon' />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item name='login_page_bg_image' label={t('Login Background')}>
						<UploadConfigFile form={form} fieldName='login_page_bg_image' />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Company Name')} name='company_name'>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Website')} name='website'>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Email')} name='email'>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Admin Email')} name='admin_email'>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Telephone')} name='telephone'>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Booking Fee')} name='booking_fee'>
						<Input type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('First Payment Day')} name='first_payment_day'>
						<Input type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Residue Payment Day')} name='residue_payment_day'>
						<Input type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Passenger Content Update Days')}
						name='passenger_content_update_days'
					>
						<Input type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Passenger Schedule Mail Send Days')}
						name='passenger_schedule_mail_send_days'
					>
						<Input type='number' min={0} />
					</Form.Item>
				</Col>
			</Row>
			<Row align='middle' justify='center'>
				<Col span={3}>
					<Button block type='cancel' htmlType='button' onClick={() => form?.resetFields()}>
						{t('Cancel')}
					</Button>
				</Col>
				<Col span={3} className='margin-4'>
					<Button block type='primary' htmlType='submit' loading={isLoading}>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};