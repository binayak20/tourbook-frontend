import { stationsAPI } from '@/libs/api';
import { Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { StationForm } from './StationForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const SettingsStationCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.StationPayload) => stationsAPI.create(values),
		{
			onSuccess: () => {
				setVisible(false);
				form.resetFields();
				queryClient.invalidateQueries('stations');
				message.success(t('Station has been created!'));
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
			title={t('Create New Station')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<StationForm isLoading={isLoading} onCancel={() => setVisible(false)} />
			</Form>
		</Modal>
	);
};
