import { emailConfigsAPI } from '@/libs/api';
import { Button, Form, Input, message, Modal, Radio, Typography } from 'antd';
import { FC, Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

type EmailConfigureModalProps = {
	data?: API.EmailProviderConfig;
	providers?: API.EmailProvider[];
	isModalVisible?: boolean;
	onClose?: () => void;
};

export const EmailConfigureModal: FC<EmailConfigureModalProps> = (props) => {
	const { providers, data, isModalVisible, onClose } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (data) {
			form.setFieldsValue({
				email_provider: data.email_provider.id,
				from_email: data.from_email,
				api_key: data.api_key,
			});
		}
	}, [data, form]);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: API.EmailProviderConfigPayload) =>
			data
				? emailConfigsAPI.updateEmailProviderConfig(data!.id, {
						...payload,
						email_provider: data.email_provider.id,
				  })
				: emailConfigsAPI.createEmailProviderConfig(payload),
		{
			onSuccess: () => {
				onClose?.();
				queryClient.invalidateQueries(['providerConfigurations']);
				queryClient.invalidateQueries(['unconfiguredEmailProviders']);
				message.success(
					t(`Email provider configuration has been ${data ? 'updated' : 'created'}!`)
				);
			},
		}
	);

	return (
		<Modal
			title={t(data ? 'Update email provider' : 'Configure email provider')}
			open={isModalVisible}
			onCancel={onClose}
			footer={false}
			maskClosable={false}
			bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
			afterClose={() => form.resetFields()}
			getContainer={false}
		>
			<Form form={form} size='large' labelAlign='left' layout='vertical' onFinish={handleSubmit}>
				{data ? (
					<Fragment>
						<Typography.Text>{t('Email provider')}</Typography.Text>
						<Typography.Paragraph strong>{data?.email_provider?.name}</Typography.Paragraph>
					</Fragment>
				) : (
					<Form.Item
						label={t('Email providers')}
						name='email_provider'
						rules={[{ required: true, message: t('Email provider is required!') }]}
					>
						<Radio.Group>
							{providers?.map(({ id, name }) => (
								<Radio key={id} value={id}>
									{name}
								</Radio>
							))}
						</Radio.Group>
					</Form.Item>
				)}
				<Form.Item
					label={t('From email')}
					name='from_email'
					rules={[{ required: true, message: t('From email is required!') }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={t('API key')}
					name='api_key'
					rules={[{ required: true, message: t('API key is required!') }]}
				>
					<Input />
				</Form.Item>
				<Button htmlType='submit' type='primary' loading={isLoading}>
					{t('Save changes')}
				</Button>
			</Form>
		</Modal>
	);
};
