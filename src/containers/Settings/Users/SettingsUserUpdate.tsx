import { usersAPI } from '@/libs/api';
import { Card, Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { UserForm } from './UserForm';

type SettingsUserUpdateProps = {
	id: number;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	clearId: () => void;
	onSuccess: () => void;
};

export const SettingsUserUpdate: FC<SettingsUserUpdateProps> = ({
	isVisible,
	setVisible,
	id,
	clearId,
	onSuccess,
}) => {
	const { t } = useTranslation();

	const { data, isLoading } = useQuery(['settings-user', id], () => usersAPI.user(id!), {
		staleTime: Infinity,
		cacheTime: 0,
	});

	const handleCancel = () => {
		setVisible(false);
		clearId();
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: API.UserUpdatePayload) => usersAPI.updateUser(id!, values),
		{
			onSuccess: () => {
				setVisible(false);
				onSuccess();
				message.success(t('User has been updated!'));
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
			title={t('Edit User')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Card loading={isLoading} bordered={false} bodyStyle={{ padding: 0 }}>
				{data && (
					<Form
						layout='vertical'
						size='large'
						onFinish={handleSubmit}
						initialValues={{
							...data,
							groups: data.groups?.filter((id) => id !== 1),
						}}
					>
						<UserForm isLoading={isSubmitLoading} onCancel={handleCancel} />
					</Form>
				)}
			</Card>
		</Modal>
	);
};
