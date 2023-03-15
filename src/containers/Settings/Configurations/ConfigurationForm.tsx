import { Button } from '@/components/atoms';
import { accountingAPI, currenciesAPI, emailConfigsAPI } from '@/libs/api';
import { useStoreSelector } from '@/store';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import {
	Col,
	ConfigProvider,
	Divider,
	Form,
	FormInstance,
	Input,
	InputNumber,
	Row,
	Select,
} from 'antd';
import { ChangeEvent, FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';
import styled from 'styled-components';
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

	const [
		{ data: currencies, isLoading: isCurrenciesLoading },
		{ data: emailProviders, isLoading: isEmailProvidersLoading },
		{ data: accountingProviders, isLoading: isAccountingProvidersLoading },
	] = useQueries([
		{
			queryKey: ['currencies'],
			queryFn: () => currenciesAPI.list({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
		{
			queryKey: ['providerConfigurations'],
			queryFn: () =>
				emailConfigsAPI.emailProviderConfig({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
		{
			queryKey: ['accounting-configs'],
			queryFn: () => accountingAPI.list({ ...DEFAULT_LIST_PARAMS, is_active: true }),
		},
	]);

	const handleColorCodeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value) {
			ConfigProvider.config({ theme: { primaryColor: e.target.value } });
		}
	}, []);

	const SegmentDivider = styled(Divider)`
		&& {
			font-size: 1.35rem;
		}
	`;

	return (
		<Row gutter={[0, 20]} style={{ padding: '0  0.5rem' }}>
			<Col span={24}>
				<Row gutter={40}>
					<Col span={24}>
						<SegmentDivider orientation='left' orientationMargin={0}>
							{t('General Information')}
						</SegmentDivider>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Address')} name='address'>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Post Code')} name='postcode'>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('City')} name='city'>
							<Input />
						</Form.Item>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<Row gutter={40}>
					<Col span={24}>
						<SegmentDivider orientation='left' orientationMargin={0}>
							{t('System Information')}
						</SegmentDivider>
					</Col>
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
							rules={[
								{
									pattern: new RegExp(/^[0-9]*$/),
									required: true,
									message: t('Please enter a valid telephone number'),
								},
							]}
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
							label={t('First payment reminder days')}
							name='first_payment_remainder_days'
							rules={[{ required: true, message: t('Please select a day') }]}
						>
							<Select
								showArrow
								mode='multiple'
								placeholder={t('Please choose an option')}
								options={[...Array(30).keys()].map((item) => ({
									label: item + 1,
									value: item + 1,
								}))}
							/>
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item
							label={t('Residue payment reminder days')}
							name='residue_payment_remainder_days'
							rules={[{ required: true, message: t('Please select a day') }]}
						>
							<Select
								showArrow
								mode='multiple'
								placeholder={t('Please choose an option')}
								options={[...Array(30).keys()].map((item) => ({
									label: item + 1,
									value: item + 1,
								}))}
							/>
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
						<Form.Item
							label={t('Organization Number')}
							name='organization_number'
							rules={[
								{
									pattern: new RegExp(/^[0-9-]*$/),
									message: t('Please enter a valid organization number'),
								},
							]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Email Provider')} name='email_provider'>
							<Select
								placeholder={t('Choose an option')}
								loading={isEmailProvidersLoading}
								options={emailProviders?.results?.map(({ email_provider: { id, name } }) => ({
									value: id,
									label: name,
								}))}
								disabled
							/>
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Accounting Service Provider')} name='accounting_service_provider'>
							<Select
								placeholder={t('Choose an option')}
								loading={isAccountingProvidersLoading}
								options={accountingProviders?.results?.map(
									({ accounting_service_provider: { id, name } }) => ({
										value: id,
										label: name,
									})
								)}
								disabled
							/>
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Vat Percentage')} name='departed_tour_vat_percentage'>
							<Input />
						</Form.Item>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={40}>
					<Col span={24}>
						<SegmentDivider orientation='left' orientationMargin={0}>
							{t('Invoice Information')}
						</SegmentDivider>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('VAT Number')} name='vat_number'>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Bank Giro Number')} name='bank_giro_number'>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Plus Giro Number')} name='plus_giro_number'>
							<Input />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={t('Invoice Description')} name='invoice_description'>
							<Input.TextArea rows={4} />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('IBAN')} name='iban_number'>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('SWIFT/BIC')} name='swift_bic_code'>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Invoice Payment Days')} name='invoice_payment_days'>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Late Payment Interest')} name='late_payment_interest'>
							<Input />
						</Form.Item>
					</Col>
					<Col lg={12} xl={8}>
						<Form.Item label={t('Travel Condition Link')} name='travel_condition_link'>
							<Input />
						</Form.Item>
					</Col>
				</Row>
			</Col>
			<Col span={24}>
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
			</Col>
		</Row>
	);
};
