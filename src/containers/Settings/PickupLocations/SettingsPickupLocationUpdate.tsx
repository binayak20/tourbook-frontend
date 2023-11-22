import { locationsAPI } from '@/libs/api';
import { Card, Form, message, Modal, theme } from 'antd';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { PickupLocationForm } from './PickupLocationForm';

type Props = {
	updateData: API.PickupLocation;
	isVisible: boolean;
	setVisible: (isVisible: boolean) => void;
	clearId: () => void;
};

export const SettingsPickupLocationUpdate: FC<Props> = ({
	isVisible,
	setVisible,
	updateData,
	clearId,
}) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();
	const { token } = theme.useToken();

	const { mutate: deletePickupLoaction, isLoading: isDeleteLoading } = useMutation(
		(id: number) => locationsAPI.pickupLocationDelete(id),
		{
			onSuccess: () => {
				form.resetFields();
				setVisible(false);
				queryClient.invalidateQueries('settings-pickup-locations');
				message.success(t('Pickup location has been deleted!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const pickupLocationData = updateData;
	const id = pickupLocationData?.id;

	const deleteThisPickupLocation = () => {
		deletePickupLoaction(id);
	};

	useEffect(() => {
		form.setFieldsValue({
			name: pickupLocationData?.name,
			description: pickupLocationData?.description,
			pickup_location_area: pickupLocationData?.pickup_location_area?.id,
		});
	}, [pickupLocationData, form, isVisible]);

	const handleCancel = () => {
		setVisible(false);
		clearId();
	};

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: API.PickupLocationCreatePayload) => locationsAPI.pickupLocationUpdate(id, values),
		{
			onSuccess: () => {
				form.resetFields();
				setVisible(false);
				queryClient.invalidateQueries('settings-pickup-locations');
				message.success(t('Pickup location has been updated!'));
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
			title={t('Edit pickup location')}
			open={isVisible}
			footer={false}
			onCancel={() => setVisible(false)}
			width='50%'
		>
			<Card
				loading={!updateData}
				bordered={false}
				style={{ boxShadow: 'none' }}
				bodyStyle={{ padding: 0, backgroundColor: token.colorBgElevated }}
			>
				<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
					<PickupLocationForm
						isLoading={isSubmitLoading}
						onCancel={handleCancel}
						formOperation={'update'}
						handleDelete={deleteThisPickupLocation}
						isDeleteLoading={isDeleteLoading}
					/>
				</Form>
			</Card>
		</Modal>
	);
};
