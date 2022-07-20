import { settingsAPI } from '@/libs/api';
import { Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { LocationForm } from './LocationForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const SettingsLocationsCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.LocationCreateUpdatePayload) => settingsAPI.locationCreate(values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.prefetchQuery('settings-locations', () => settingsAPI.locations());
				message.success(t('Location has been created!'));
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
			title={t('Create New Location')}
			visible={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Form layout='vertical' size='large' onFinish={handleSubmit}>
				<LocationForm isLoading={isLoading} onCancel={() => setVisible(false)} />
			</Form>
		</Modal>
	);
};
