import { settingsAPI } from '@/libs/api';
import { Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { AccomodationForm } from './AccomodationForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const SettingsAccomodationCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.AccomodationCreateUpdatePayload) => settingsAPI.accomodationCreate(values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.prefetchQuery('settings-accomodations', () => settingsAPI.accommodations());
				message.success(t('Accomodation has been created!'));
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
			title={t('Create New Accomodation')}
			visible={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Form layout='vertical' size='large' onFinish={handleSubmit}>
				<AccomodationForm isLoading={isLoading} onCancel={() => setVisible(false)} />
			</Form>
		</Modal>
	);
};
