import { locationsAPI } from '@/libs/api';
import { Card, Form, message, Modal } from 'antd';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { LocationForm } from './LocationForm';

type Props = {
	id: number;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	clearId: () => void;
};

export const SettingsLocationsUpdate: FC<Props> = ({ isVisible, setVisible, id, clearId }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	const { data, isLoading } = useQuery(['settings-location', id], () => locationsAPI.getOne(id!), {
		enabled: !!id,
		staleTime: Infinity,
		cacheTime: 0,
	});

	useEffect(() => {
		form.setFieldsValue({
			name: data?.name,
			territory: data?.country?.territory?.id,
			country: data?.country?.id,
		});
	}, [data, form]);

	const handleCancel = () => {
		setVisible(false);
		clearId();
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: API.LocationCreatePayload) => locationsAPI.update(id, values),
		{
			onSuccess: () => {
				setVisible(false);
				queryClient.invalidateQueries('locations');
				message.success(t('Location has been updated!'));
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
			title={t('Edit Location')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Card loading={isLoading} bordered={false} bodyStyle={{ padding: 0 }}>
				<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
					<LocationForm isLoading={isSubmitLoading} onCancel={handleCancel} />
				</Form>
			</Card>
		</Modal>
	);
};
