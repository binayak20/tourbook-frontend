import { settingsAPI } from '@/libs/api';
import { CategoryCreatePayload } from '@/libs/api/@types/settings';
import { Card, Form, message, Modal } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CategoryForm } from './CategoryForm';

type Props = {
	id: number;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	clearId: () => void;
};

export const SettingsCategoryUpdate: FC<Props> = ({ isVisible, setVisible, id, clearId }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery(['settings-category', id], () => settingsAPI.category(id!), {
		staleTime: Infinity,
		cacheTime: 0,
	});
	const handleCancel = () => {
		setVisible(false);
		clearId();
	};
	const initialData = {
		name: data?.name,
		parent: data?.parent?.id,
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: CategoryCreatePayload) => settingsAPI.categoryUpdate(id, values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.invalidateQueries('categories');
				queryClient.invalidateQueries('parentCategories');
				message.success(t('Category has been updated!'));
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
			title={t('Edit Category')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
		>
			<Card loading={isLoading} bordered={false} bodyStyle={{ padding: 0 }}>
				<Form layout='vertical' size='large' onFinish={handleSubmit} initialValues={initialData}>
					<CategoryForm isLoading={isSubmitLoading} onCancel={handleCancel} />
				</Form>
			</Card>
		</Modal>
	);
};
