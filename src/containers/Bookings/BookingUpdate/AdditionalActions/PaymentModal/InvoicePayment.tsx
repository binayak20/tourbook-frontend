import { Typography } from '@/components/atoms';
import { useBookingContext } from '@/components/providers/BookingProvider';
import config from '@/config';
import { bookingsAPI, locationsAPI } from '@/libs/api';
import { useStoreSelector } from '@/store';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { selectFilterBy } from '@/utils/helpers';
import {
	Button,
	Col,
	DatePicker,
	Form,
	FormInstance,
	Input,
	InputNumber,
	ModalProps,
	Popconfirm,
	Row,
	Select,
	message,
} from 'antd';
import moment from 'moment';
import { FC, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

type FormValues = API.InvoicePaymentPayload['payment_address'] & {
	amount: number;
	expiry_date: moment.Moment;
	first_name: string;
	last_name: string;
	email?: string;
	customer_type?: string;
	company_name: string;
	organisation_number: string;
};

type InvoicePaymentProps = Pick<ModalProps, 'onCancel'>;

export const InvoicePayment: FC<InvoicePaymentProps> = (props) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const formRef = useRef<FormInstance>(null);
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();
	const [saveAndSend, setSaveAndSend] = useState(false);
	const { bankGiro, invoicePaymentDays } = useStoreSelector((state) => state.app);
	const { bookingInfo } = useBookingContext();

	const handleCancel = useCallback(
		(e: MouseEvent<HTMLElement>) => {
			props.onCancel?.(e);
			form.resetFields();
		},
		[props, form]
	);

	const customerTypeOptions = [
		{ value: 'private', label: 'Private' },
		{ value: 'company', label: 'Company' },
	];

	const { data: countries, isLoading: countryListLoading } = useQuery(['countries'], () =>
		locationsAPI.countries(DEFAULT_LIST_PARAMS)
	);

	const countryOptions = useMemo(
		() =>
			countries?.results.map(({ name }) => ({
				value: name,
				label: name,
			})) || [],
		[countries]
	);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: FormValues) => {
			const payload: API.InvoicePaymentPayload = {
				amount: values.amount,
				customer_type: values.customer_type,
				email: values.email,
				expiry_date: values?.expiry_date?.format(config.dateFormat),
				payment_address: {
					address: values?.address,
					city: values.city,
					post_code: values.post_code,
					country: values.country,
				},
				country: countries?.results.find((country) => country.name === values.country)?.id,
			};
			if (values.customer_type === 'private') {
				payload.first_name = values.first_name;
				payload.last_name = values.last_name;
			}
			if (values.customer_type === 'company') {
				payload.company_information = {
					company_name: values.company_name,
					organisation_number: values.organisation_number,
				};
			}
			return bookingsAPI.addInvoicePayment(id, saveAndSend, payload);
		},
		{
			onSuccess: () => {
				form.resetFields();
				queryClient.invalidateQueries(['booking']);
				queryClient.invalidateQueries(['bookingTransactions']);
				message.success(t('Payment completed successfully!'));
				handleCancel(undefined as unknown as MouseEvent<HTMLElement>);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleConfirm = () => {
		if (formRef.current) {
			formRef.current.submit();
		}
	};
	const currentCustomerType = Form.useWatch('customer_type', form);
	const countryName = 'Sweden';

	useEffect(() => {
		if (currentCustomerType === 'company') {
			form.setFieldsValue({
				expiry_date: undefined,
				address: undefined,
				post_code: undefined,
				city: undefined,
				country: undefined,
				first_name: undefined,
				last_name: undefined,
				email: undefined,
			});
			return;
		}
		form.setFieldsValue({
			...bookingInfo?.primary_passenger,
			expiry_date: moment().add(invoicePaymentDays, 'd'),
			country: countryName,
		});
	}, [currentCustomerType, bookingInfo, form, invoicePaymentDays]);

	return (
		<>
			<Typography.Title level={4} type='primary' style={{ textAlign: 'center', marginBottom: 16 }}>
				{t('Add Invoice Payment')}
			</Typography.Title>
			<Typography.Title
				type='primary'
				style={{ fontSize: 16, margin: 0, textAlign: 'center', marginBottom: 32 }}
			>
				Bank giro Number: <span style={{ fontWeight: 'normal' }}>{bankGiro}</span>
			</Typography.Title>

			<Form
				form={form}
				ref={formRef}
				layout='vertical'
				size='large'
				onFinish={(values) => {
					handleSubmit(values);
				}}
				initialValues={{
					expiry_date: moment().add(invoicePaymentDays, 'd'),
					address: bookingInfo?.primary_passenger?.address,
					post_code: bookingInfo?.primary_passenger?.post_code,
					city: bookingInfo?.primary_passenger?.city,
					country: countryName,
					first_name: bookingInfo?.primary_passenger?.first_name,
					last_name: bookingInfo?.primary_passenger?.last_name,
					email: bookingInfo?.primary_passenger?.email,
					customer_type: bookingInfo?.customer_type || 'private',
				}}
			>
				<Row gutter={12}>
					<Col span={24}>
						<Row gutter={12} align='middle'>
							<Col span={24}>
								<Form.Item
									name='customer_type'
									label={t('Customer type')}
									rules={[{ required: true, message: t('Customer type is required!') }]}
								>
									<Select options={customerTypeOptions} />
								</Form.Item>
							</Col>
							{Form.useWatch('customer_type', form) === 'company' ? (
								<>
									<Col span={12}>
										<Form.Item
											name='company_name'
											label={t('Company name')}
											rules={[{ required: true, message: t('Company name is required!') }]}
										>
											<Input style={{ width: '100%' }} placeholder={t('Company name')} />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item
											name='organisation_number'
											label={t('Organisation number')}
											rules={[{ required: true, message: t('Organisation number is required!') }]}
										>
											<Input style={{ width: '100%' }} placeholder={t('Organisation number')} />
										</Form.Item>
									</Col>
								</>
							) : (
								<>
									<Col span={12}>
										<Form.Item
											name='first_name'
											label={t('First name')}
											rules={[{ required: true, message: t('First name is required!') }]}
										>
											<Input style={{ width: '100%' }} placeholder={t('First name')} />
										</Form.Item>
									</Col>
									<Col span={12}>
										<Form.Item name='last_name' label={t('Last name')}>
											<Input style={{ width: '100%' }} placeholder={t('First name')} />
										</Form.Item>
									</Col>
								</>
							)}

							<Col span={24}>
								<Form.Item name='email' label={t('Email')}>
									<Input style={{ width: '100%' }} placeholder={t('Email')} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='amount'
									label={t('Amount')}
									rules={[{ required: true, message: t('Payment amount is required!') }]}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder={t('Payment amount')}
										precision={0}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='expiry_date'
									label={t('Expiry date')}
									rules={[{ required: true, message: t('Expiry date is required!') }]}
								>
									<DatePicker
										style={{ width: '100%' }}
										format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
									/>
								</Form.Item>
							</Col>
						</Row>
					</Col>

					<Col span={12}>
						<Form.Item
							name='address'
							label={t('Invoice address')}
							rules={[{ required: true, message: t('Address is required!') }]}
						>
							<Input style={{ width: '100%' }} placeholder={t('Address')} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='country'
							label={t('Country')}
							rules={[{ message: t('Country is required!') }]}
						>
							<Select
								value='Sweden'
								loading={countryListLoading}
								options={countryOptions}
								placeholder={t('Select country')}
								showSearch
								filterOption={selectFilterBy}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='post_code'
							label={t('Post code')}
							rules={[{ required: true, message: t('Post code is required!') }]}
						>
							<Input style={{ width: '100%' }} placeholder={t('Post code')} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='city'
							label={t('City')}
							rules={[{ required: true, message: t('City is required!') }]}
						>
							<Input style={{ width: '100%' }} placeholder={t('City')} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16} justify='center' style={{ marginTop: 30 }}>
					<Col>
						<Button
							type='primary'
							htmlType='submit'
							loading={isLoading && !saveAndSend}
							onClick={() => {
								setSaveAndSend(false);
							}}
							style={{ minWidth: 120 }}
						>
							{t('Save')}
						</Button>
					</Col>
					<Col>
						<Popconfirm
							title={t('Are you sure you want to save and send invoice to customer ?')}
							onConfirm={() => {
								setSaveAndSend(true);
								handleConfirm();
							}}
							okText={t('Yes')}
							cancelText={t('No')}
						>
							<Button
								type='primary'
								htmlType='submit'
								loading={isLoading && saveAndSend}
								style={{ minWidth: 120 }}
							>
								{t('Save and Send')}
							</Button>
						</Popconfirm>
					</Col>
				</Row>
			</Form>
		</>
	);
};
