import { settingsAPI } from '@/libs/api';
import { Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { AccommodationForm } from './AccommodationForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const SettingsAccommodationCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.AccommodationCreateUpdatePayload) => settingsAPI.accommodationCreate(values),
		{
			onSuccess: () => {
				form.resetFields();
				setVisible(false);
				queryClient.prefetchQuery('settings-accomodations', () => settingsAPI.accommodations());
				message.success(t('Accommodation has been created!'));
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
			title={t('Create New Accommodation')}
			visible={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<AccommodationForm isLoading={isLoading} onCancel={() => setVisible(false)} />
			</Form>
		</Modal>
	);
};
