import { Button } from '@/components/atoms';
import { currenciesAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Col, Form, FormInstance, Input, Row, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import UploadConfigFile from './UploadConfigFile';

type Props = {
	form: FormInstance;
	saveButtonText?: string;
	isLoading?: boolean;
};

export const ConfigurationForm: FC<Props> = ({ form, saveButtonText, isLoading }) => {
	const { t } = useTranslation();

	const [{ data: currencies, isLoading: isCurrenciesLoading }] = useQueries([
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list(DEFAULT_LIST_PARAMS) },
	]);

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
					<Form.Item label={t('Minimum Booking Fee Percentage for Booking')} name='booking_fee'>
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
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Default Currency')}
						name='default_currency'
						rules={[{ required: true, message: t('Currency is required!') }]}
					>
						<Select
							placeholder={t('Choose an option')}
							loading={isCurrenciesLoading}
							options={currencies?.results?.map(({ id, name }) => ({
								value: id,
								label: name,
							}))}
							disabled
						/>
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Admin Portal Domain')} name='domain_admin_portal'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Customer Portal Domain')} name='domain_customer_portal'>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Color Code')} name='color_code'>
						<Input type='color' />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Organization Number')} name='organization_number'>
						<Input />
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
