import { Typography } from '@/components/atoms';
import config from '@/config';
import { bookingsAPI } from '@/libs/api';
import { Button, Col, DatePicker, Form, InputNumber, message, Modal, ModalProps, Row } from 'antd';
import dayjs from 'dayjs';
import { FC, MouseEvent, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

export const RefundModal: FC<ModalProps> = (props) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();

	const handleCancel = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			props.onCancel?.(e);
			form.resetFields();
		},
		[props, form]
	);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: API.ManualPaymentPayload) =>
			bookingsAPI.addManualRefund(id, {
				amount: payload.amount,
				date: dayjs(payload.date).format(config.dateFormat),
			}),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(['booking']);
				queryClient.invalidateQueries(['bookingTransactions']);
				message.success(t('Refund completed successfully!'));
				handleCancel(undefined as unknown as MouseEvent<HTMLButtonElement>);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Modal centered width={700} footer={false} afterClose={form.resetFields} {...props}>
			<Typography.Title level={4} type='primary' style={{ textAlign: 'center', marginBottom: 30 }}>
				{t('Make Refund')}
			</Typography.Title>

			<Form
				form={form}
				layout='vertical'
				size='large'
				initialValues={{ date: dayjs(new Date()) }}
				onFinish={handleSubmit}
			>
				<Row>
					<Col span={18} offset={3}>
						<Row gutter={12}>
							<Col span={12}>
								<Form.Item
									name='amount'
									rules={[{ required: true, message: t('Refund amount is required!') }]}
								>
									<InputNumber style={{ width: '100%' }} placeholder={`${t('Refund amount')} *`} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='date'
									rules={[{ required: true, message: t('Refund date is required!') }]}
								>
									<DatePicker
										showToday={false}
										format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
										disabledDate={(d) => !d || d.isAfter(new Date())}
										style={{ width: '100%' }}
									/>
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
								<Button
									type='primary'
									htmlType='submit'
									style={{ minWidth: 120 }}
									loading={isLoading}
								>
									{t('Save')}
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};
