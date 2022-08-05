import { settingsAPI } from '@/libs/api';
import { Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { CategoryForm } from './CategoryForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const SettingsCategoryCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.CategoryCreatePayload) => settingsAPI.categoryCreate(values),
		{
			onSuccess: () => {
				form.resetFields();
				setVisible(false);
				queryClient.prefetchQuery('settings-categories', () => settingsAPI.categories());
				message.success(t('Category has been created!'));
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
			title={t('Create New Category')}
			visible={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<CategoryForm isLoading={isLoading} onCancel={() => setVisible(false)} />
			</Form>
		</Modal>
	);
};
