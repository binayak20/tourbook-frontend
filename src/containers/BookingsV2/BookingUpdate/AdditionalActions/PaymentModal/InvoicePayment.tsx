import { Typography } from '@/components/atoms';
import { bookingsAPI } from '@/libs/api';
import { useStoreSelector } from '@/store';
import { Button, Col, Form, Input, InputNumber, message, ModalProps, Row } from 'antd';
import { FC, MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

type FormValues = API.InvoicePaymentPayload['payment_address'] & {
	amount: number;
};

type InvoicePaymentProps = Pick<ModalProps, 'onCancel'>;

export const InvoicePayment: FC<InvoicePaymentProps> = (props) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();
	const { bankGiro } = useStoreSelector((state) => state.app);

	const handleCancel = useCallback(
		(e: MouseEvent<HTMLElement>) => {
			props.onCancel?.(e);
			form.resetFields();
		},
		[props, form]
	);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: FormValues) => {
			const payload: API.InvoicePaymentPayload = {
				amount: values.amount,
				payment_address: {
					house: values.house,
					street: values.street,
					city: values.city,
					post_code: values.post_code,
				},
			};
			return bookingsAPI.addInvoicePayment(id, payload);
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

	return (
		<>
			<Typography.Title level={4} type='primary' style={{ textAlign: 'center', marginBottom: 30 }}>
				{t('Add Invoice Payment')}
			</Typography.Title>

			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<Row gutter={12}>
					<Col span={24}>
						<Row gutter={12} align='middle'>
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
								<Typography.Title type='primary' style={{ fontSize: 16, margin: 0 }}>
									Bank giro Number: <span style={{ fontWeight: 'normal' }}>{bankGiro}</span>
								</Typography.Title>
							</Col>
						</Row>
					</Col>
					<Col span={12}>
						<Form.Item
							name='house'
							label={t('House')}
							rules={[{ required: true, message: t('House is required!') }]}
						>
							<Input
								style={{ width: '100%' }}
								placeholder={t('Apartment, suite, unit, building, floor, etc.')}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='street'
							label={t('Street')}
							rules={[{ required: true, message: t('Street is required!') }]}
						>
							<Input
								style={{ width: '100%' }}
								placeholder={t('Street address, P.O. box, company name, c/o')}
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
							type='default'
							htmlType='button'
							style={{ minWidth: 120 }}
							onClick={handleCancel}
						>
							{t('Cancel')}
						</Button>
					</Col>
					<Col>
						<Button type='primary' htmlType='submit' style={{ minWidth: 120 }} loading={isLoading}>
							{t('Save')}
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
};
