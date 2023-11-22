import { toursAPI } from '@/libs/api';

import { TourTagCreatePayload } from '@/libs/api/@types';
import { Card, Form, Modal, message, theme } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { TagForm } from './TagForm';

type Props = {
	id: number;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	clearId: () => void;
};

export const TourTagUpdate: FC<Props> = ({ isVisible, setVisible, id, clearId }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { token } = theme.useToken();

	const { data, isLoading } = useQuery(['single-tour-tag', id], () => toursAPI.tourTag(id!), {
		staleTime: Infinity,
		cacheTime: 0,
	});
	const handleCancel = () => {
		setVisible(false);
		clearId();
	};
	const initialData = {
		name: data?.name,
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: TourTagCreatePayload) => toursAPI.tourTagUpdate(id, values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.invalidateQueries('tour-tags');
				message.success(t('Tag has been updated!'));
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
			title={t('Edit tag')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
		>
			<Card
				loading={isLoading}
				bordered={false}
				style={{ boxShadow: 'none' }}
				bodyStyle={{ padding: 0, backgroundColor: token.colorBgElevated }}
			>
				<Form layout='vertical' size='large' onFinish={handleSubmit} initialValues={initialData}>
					<TagForm isLoading={isSubmitLoading} onCancel={handleCancel} />
				</Form>
			</Card>
		</Modal>
	);
};
