import { settingsAPI } from '@/libs/api';
import { AccommodationCreateUpdatePayload } from '@/libs/api/@types/settings';
import { Card, Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AccommodationForm } from './AccommodationForm';

type Props = {
	id: number;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	clearId: () => void;
};

export const SettingsAccommodationUpdate: FC<Props> = ({ isVisible, setVisible, id, clearId }) => {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery(['accomodation', id], () => settingsAPI.accommodation(id!), {
		staleTime: Infinity,
		cacheTime: 0,
	});

	const handleCancel = () => {
		setVisible(false);
		clearId();
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: AccommodationCreateUpdatePayload) => settingsAPI.accommodationUpdate(id, values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.invalidateQueries('accomodation');
				queryClient.invalidateQueries('accomodations');
				message.success(t('Accommodation has been updated!'));
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
			title={t('Edit Accommodation')}
			visible={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Card loading={isLoading} bordered={false} bodyStyle={{ padding: 0 }}>
				<Form layout='vertical' size='large' onFinish={handleSubmit} initialValues={data}>
					<AccommodationForm isLoading={isSubmitLoading} onCancel={handleCancel} />
				</Form>
			</Card>
		</Modal>
	);
};
