import { locationsAPI } from '@/libs/api';
import { Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { PickupLocationForm } from './PickupLocationForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const SettingsPickupLocationCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.PickupLocationCreatePayload) => locationsAPI.PickupLocationCreate(values),
		{
			onSuccess: () => {
				setVisible(false);
				form.resetFields();
				queryClient.invalidateQueries('settings-pickup-locations');
				message.success(t('Pickup location has been created!'));
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
			title={t('Create new pickup location')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<PickupLocationForm
					isLoading={isLoading}
					onCancel={() => setVisible(false)}
					formOperation={'create'}
				/>
			</Form>
		</Modal>
	);
};
