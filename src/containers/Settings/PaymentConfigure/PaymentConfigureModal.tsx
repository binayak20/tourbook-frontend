import { paymentConfigsAPI } from '@/libs/api';
import { Button, Form, Input, message, Modal, Radio, Typography } from 'antd';
import { FC, Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

type PaymentConfigureModalProps = {
	methods?: API.UnconfiguredPaymentMethod[];
	data?: API.PaymentConfig;
	isModalVisible?: boolean;
	onClose?: () => void;
};

export const PaymentConfigureModal: FC<PaymentConfigureModalProps> = (props) => {
	const { methods, data, isModalVisible, onClose } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (data) {
			form.setFieldsValue({
				...data,
				payment_method: data.payment_method.id,
			});
		}
	}, [data, form]);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: API.PaymentConfigCreatePayload) =>
			data
				? paymentConfigsAPI.updatePaymentConfig(data!.id, {
						...payload,
						payment_method: data.payment_method.id,
				  })
				: paymentConfigsAPI.createPaymentConfig(payload),
		{
			onSuccess: () => {
				onClose?.();
				queryClient.invalidateQueries(['paymentConfigurations']);
				queryClient.invalidateQueries(['unconfiguredPaymentMethods']);
				message.success(t(`Payment configuration has been ${data ? 'updated' : 'created'}!`));
			},
		}
	);

	if (!data && !methods?.length) {
		return null;
	}

	return (
		<Modal
			title={t(data ? 'Update payment configuration' : 'Configure new payment')}
			visible={isModalVisible}
			onCancel={onClose}
			footer={false}
			maskClosable={false}
			bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
			afterClose={() => form.resetFields()}
		>
			<Form form={form} labelAlign='left' layout='vertical' size='large' onFinish={handleSubmit}>
				{data ? (
					<Fragment>
						<Typography.Text>{t('Payment method')}</Typography.Text>
						<Typography.Paragraph strong>{data?.payment_method?.name}</Typography.Paragraph>
					</Fragment>
				) : (
					<Form.Item
						label={t('Payment methods')}
						name='payment_method'
						rules={[{ required: true, message: t('Payment method is required!') }]}
					>
						<Radio.Group>
							{methods?.map(({ id, name }) => (
								<Radio key={id} value={id}>
									{name}
								</Radio>
							))}
						</Radio.Group>
					</Form.Item>
				)}
				<Form.Item
					label={t('Username')}
					name='username'
					rules={[{ required: true, message: t('Username is required!') }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={t('Password')}
					name='password'
					rules={[{ required: true, message: t('Password is required!') }]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label={t('Base URL')}
					name='base_url'
					rules={[{ required: true, message: t('Base URL is required!') }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={t('Success URL')}
					name='success_url'
					rules={[{ required: true, message: t('Success URL is required!') }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={t('Notification URL')}
					name='notification_url'
					rules={[{ required: true, message: t('Notification URL is required!') }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={t('Private key name')}
					name='private_key_name'
					rules={[{ required: true, message: t('Private key name is required!') }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={t('Private key')}
					name='private_key'
					rules={[{ required: true, message: t('Private key is required!') }]}
				>
					<Input.TextArea rows={4} />
				</Form.Item>
				<Button htmlType='submit' type='primary' loading={isLoading}>
					{t('Save changes')}
				</Button>
			</Form>
		</Modal>
	);
};
