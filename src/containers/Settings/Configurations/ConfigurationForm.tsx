import { Button } from '@/components/atoms';
import { currenciesAPI } from '@/libs/api';
import { useStoreSelector } from '@/store';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Col, ConfigProvider, Form, FormInstance, Input, InputNumber, Row, Select } from 'antd';
import { ChangeEvent, FC, useCallback, useEffect } from 'react';
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
	const { primaryColor } = useStoreSelector((state) => state.app);

	useEffect(() => {
		return () => {
			ConfigProvider.config({ theme: { primaryColor } });
		};
	}, [primaryColor]);

	const [{ data: currencies, isLoading: isCurrenciesLoading }] = useQueries([
		{ queryKey: ['currencies'], queryFn: () => currenciesAPI.list(DEFAULT_LIST_PARAMS) },
	]);

	const handleColorCodeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value) {
			ConfigProvider.config({ theme: { primaryColor: e.target.value } });
		}
	}, []);

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
					<Form.Item
						label={t('Company Name')}
						name='company_name'
						rules={[{ required: true, message: t('Company name is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Website')} name='website'>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Contact Email')}
						name='email'
						rules={[{ required: true, message: t('Email is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Admin Email')}
						name='admin_email'
						rules={[{ required: true, message: t('Admin email is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Telephone')}
						name='telephone'
						rules={[{ required: true, message: t('Telephone number is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={`${t('Minimum Booking Fee')} (%)`} name='booking_fee'>
						<InputNumber style={{ width: '100%' }} type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('First Payment Deadline')} name='first_payment_day'>
						<InputNumber style={{ width: '100%' }} type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Remaining Payment Deadline')} name='residue_payment_day'>
						<InputNumber style={{ width: '100%' }} type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Passenger Information Update Deadline')}
						name='passenger_content_update_days'
					>
						<InputNumber style={{ width: '100%' }} type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Passenger Schedule Mail Send Days')}
						name='passenger_schedule_mail_send_days'
					>
						<InputNumber style={{ width: '100%' }} type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Default Currency')}
						name='default_currency_id'
						rules={[{ required: true, message: t('Currency is required!') }]}
					>
						<Select
							placeholder={t('Choose an option')}
							loading={isCurrenciesLoading}
							options={currencies?.results?.map(({ id, currency_code }) => ({
								value: id,
								label: currency_code,
							}))}
							disabled
						/>
					</Form.Item>
					<Form.Item name='default_currency' hidden>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Admin Portal Domain')}
						name='domain_admin_portal'
						rules={[{ required: true, message: t('Domain is required!') }]}
					>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Customer Portal Domain')}
						name='domain_customer_portal'
						rules={[{ required: true, message: t('Domain is required!') }]}
					>
						<Input disabled />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item label={t('Color Code')} name='color_code'>
						<Input type='color' onChange={handleColorCodeChange} />
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
