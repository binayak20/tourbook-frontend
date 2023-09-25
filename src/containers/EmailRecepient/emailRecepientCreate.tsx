import { settingsAPI } from '@/libs/api';
import { EmailConfigPayload } from '@/libs/api/@types';
import { Card, Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { EmailRecepientForm } from './emailRecepientForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const EmailRecepientCreateModal: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	const { data, isLoading: isConfigurationLoading } = useQuery(
		'settings-configurations',
		() => settingsAPI.configurations(),
		{
			cacheTime: 0,
		}
	);

	const initialData = {
		to_email: data?.admin_email,
	};

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: EmailConfigPayload) => {
			return settingsAPI.emailConfiguration({ ...values });
		},
		{
			onSuccess: (data) => {
				form.resetFields();
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
			title={t('Create event wise recipient')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width={800}
		>
			<Card
				loading={isConfigurationLoading || isLoading}
				bordered={false}
				bodyStyle={{ padding: 0 }}
			>
				<Form
					form={form}
					layout='vertical'
					size='large'
					onFinish={handleSubmit}
					initialValues={initialData}
				>
					<EmailRecepientForm
						saveButtonText='Save'
						isLoading={isLoading}
						onCancel={() => setVisible(false)}
					/>
				</Form>
			</Card>
		</Modal>
	);
};
