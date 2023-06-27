import { emailConfigsAPI } from '@/libs/api';
import { Button, Form, message, Modal, Space, Typography } from 'antd';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { TemplateItemInput } from './TemplateItemInput';

type EmailTemplatesModalProps = {
	data?: API.EmailProviderConfig;
	isModalVisible?: boolean;
	onClose?: () => void;
};

export const EmailTemplatesModal: FC<EmailTemplatesModalProps> = (props) => {
	const { data, isModalVisible, onClose } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [isFormReady, setFormReady] = useState(false);
	const queryClient = useQueryClient();
	const EmailProviderName = data?.email_provider?.name;

	const { mutate: mutateTemplates, isLoading } = useMutation(
		(values: API.EmailTeamplatePayload[]) => emailConfigsAPI.updateEmailTemplates(values),
		{
			onSuccess: () => {
				onClose?.();
				queryClient.invalidateQueries(['providerConfigurations']);
				message.success(t('Email templates have been updated!'));
			},
		}
	);

	const handleTemplatesSubmit = useCallback(
		(values: Record<string, string>) => {
			if (data) {
				const templates: API.EmailTeamplatePayload[] = [];
				const emailTemplates = data.email_event_template;

				Object.entries(values).forEach(([key, value]) => {
					if (value) {
						const event_id = Number(key.split('_')[2]);
						const id = emailTemplates.find((template) => template.email_event === event_id)?.id;

						if (id) {
							templates.push({
								id,
								email_event: event_id,
								email_provider: data.email_provider.id,
								template_id: value,
							});
						}
					}
				});

				mutateTemplates(templates);
			}
		},
		[mutateTemplates, data]
	);

	const providerTemplates = useMemo(() => {
		if (!data) return [];

		return data.email_event_template;
	}, [data]);

	useEffect(() => {
		if (data) {
			providerTemplates.forEach(({ email_event, template_id }) => {
				form.setFieldsValue({
					[`event_id_${email_event}`]: template_id || '',
				});
			});
			setFormReady(true);
		} else {
			form.resetFields();
			setFormReady(false);
		}
	}, [form, data, providerTemplates]);

	return (
		<Modal
			title={`${t('Update template for')} ${EmailProviderName}`}
			style={{ textAlign: 'left' }}
			open={isModalVisible}
			onCancel={onClose}
			footer={false}
			maskClosable={false}
			bodyStyle={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}
			afterClose={() => form.resetFields()}
			getContainer={false}
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleTemplatesSubmit}>
				{isFormReady &&
					providerTemplates.map(
						({ id, email_event_name, email_event, email_event_description }) => (
							<TemplateItemInput
								key={id}
								label={
									<Space direction='vertical'>
										<Typography.Text strong>{email_event_name}</Typography.Text>
										{email_event_description && (
											<Typography.Text type='secondary'>{email_event_description}</Typography.Text>
										)}
									</Space>
								}
								name={`event_id_${email_event}`}
							/>
						)
					)}
				<Button htmlType='submit' type='primary' loading={isLoading}>
					{t('Save changes')}
				</Button>
			</Form>
		</Modal>
	);
};
