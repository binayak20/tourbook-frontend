import { settingsAPI } from '@/libs/api';
import { EmailConfigPayload } from '@/libs/api/@types';
import { Card, Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { EmailRecepientForm } from './emailRecepientForm';

type Props = {
	id: number;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	clearId: () => void;
};

export const EmailRecepientUpdateModal: FC<Props> = ({ isVisible, setVisible, id, clearId }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery(
		['config-email-single', id],
		() => settingsAPI.getSingleEmailConfig(id!),
		{
			staleTime: Infinity,
			cacheTime: 0,
		}
	);
	const handleCancel = () => {
		setVisible(false);
		clearId();
	};
	const initialData = {
		email_event: data?.email_event?.id,
		to_email: data?.to_email,
		cc_email: data?.cc_email || [],
		bcc_email: data?.bcc_email || [],
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: EmailConfigPayload) => settingsAPI.emailConfigUpdate(id, values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.invalidateQueries('config-email');
				queryClient.invalidateQueries('config-email-single');
				message.success(t('Recipient has been updated!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Modal
			centered
			maskClosable={false}
			title={t('Edit event wise recipient')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width={800}
		>
			<Card loading={isSubmitLoading || isLoading} bordered={false} bodyStyle={{ padding: 0 }}>
				<Form layout='vertical' size='large' onFinish={handleSubmit} initialValues={initialData}>
					<EmailRecepientForm
						saveButtonText='Update'
						isUpdated={true}
						isLoading={isSubmitLoading}
						onCancel={handleCancel}
					/>
				</Form>
			</Card>
		</Modal>
	);
};
