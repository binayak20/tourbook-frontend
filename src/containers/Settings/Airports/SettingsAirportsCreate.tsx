import { settingsAPI } from '@/libs/api';
import { Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { AirportsForm } from './AirportsForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const SettingsAirportsCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.AirportCreatePayload) => settingsAPI.airportCreate(values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.prefetchQuery('settings-airports', () => settingsAPI.airports());
				message.success(t('Airport has been created!'));
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
			title={t('Create New Airport')}
			visible={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Form layout='vertical' size='large' onFinish={handleSubmit}>
				<AirportsForm isLoading={isLoading} onCancel={() => setVisible(false)} />
			</Form>
		</Modal>
	);
};