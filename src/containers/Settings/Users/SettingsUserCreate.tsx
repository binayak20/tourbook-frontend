import { usersAPI } from '@/libs/api';
import { Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { UserForm } from './UserForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	onSuccess: () => void;
};

export const SettingsUserCreate: FC<Props> = ({ isVisible, setVisible, onSuccess }) => {
	const { t } = useTranslation();
	const [form] = Form.useForm();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.UserCreatePayload) =>
			usersAPI.createUser({
				...values,
				is_superuser: values.is_superuser || false,
				is_passenger: values.is_passenger || false,
			}),
		{
			onSuccess: () => {
				form.resetFields();
				setVisible(false);
				onSuccess();
				message.success(t('User has been created!'));
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
			title={t('Create New User')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<UserForm isLoading={isLoading} onCancel={() => setVisible(false)} />
			</Form>
		</Modal>
	);
};
