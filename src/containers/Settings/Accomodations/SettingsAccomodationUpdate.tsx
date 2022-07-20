import { settingsAPI } from '@/libs/api';
import { Card, Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AccomodationForm } from './AccomodationForm';

type Props = {
	id: number;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	clearId: () => void;
};

export const SettingsAccomodationUpdate: FC<Props> = ({ isVisible, setVisible, id, clearId }) => {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery(
		['settings-accomodation', id],
		() => settingsAPI.accomodation(id!),
		{
			staleTime: Infinity,
			cacheTime: 0,
		}
	);

	const handleCancel = () => {
		setVisible(false);
		clearId();
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: API.AccomodationCreateUpdatePayload) => settingsAPI.accomodationUpdate(id, values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.prefetchQuery('settings-accomodations', () => settingsAPI.accommodations());
				message.success(t('Accomodation has been updated!'));
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
			title={t('Edit Accomodation')}
			visible={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Card loading={isLoading} bordered={false} bodyStyle={{ padding: 0 }}>
				<Form layout='vertical' size='large' onFinish={handleSubmit} initialValues={data}>
					<AccomodationForm isLoading={isSubmitLoading} onCancel={handleCancel} />
				</Form>
			</Card>
		</Modal>
	);
};
