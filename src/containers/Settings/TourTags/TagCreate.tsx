import { toursAPI } from '@/libs/api';
import { TourTagCreatePayload } from '@/libs/api/@types';
import { Form, Modal, message } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { TagForm } from './TagForm';

type Props = {
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
};

export const TourTagCreate: FC<Props> = ({ isVisible, setVisible }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: TourTagCreatePayload) => toursAPI.tourTagCreate(values),
		{
			onSuccess: () => {
				form.resetFields();
				setVisible(false);
				queryClient.invalidateQueries('tour-tags');
				message.success(t('Tag has been created!'));
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
			title={t('Create new tag')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<TagForm isLoading={isLoading} onCancel={() => setVisible(false)} />
			</Form>
		</Modal>
	);
};
