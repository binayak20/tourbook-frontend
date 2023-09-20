import { settingsAPI } from '@/libs/api';
import { EmailConfigPayload } from '@/libs/api/@types';
import { Card, Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CreateEmailConfiguration } from './createEmailConfig';

type Props = {
	id: number;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const EmailConfigUpdate: FC<Props> = ({ isVisible, setVisible, id }) => {
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
	};
	const initialData = {
		email_event: data?.email_event?.id,
		to_email: data?.to_email,
		cc_email: data?.cc_email || [],
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: EmailConfigPayload) => settingsAPI.emailConfigUpdate(id, values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.invalidateQueries('config-email');
				message.success(t('Configuration has been updated!'));
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
					<CreateEmailConfiguration
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
