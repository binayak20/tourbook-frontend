import { vehiclesAPI } from '@/libs/api';
import { VehicleType, VehicleTypePayload } from '@/libs/api/@types';
import { Button, Form, Input, message, Modal } from 'antd';
import { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';

type Props = {
	data?: VehicleType;
	isVisible: boolean;
	onHide: () => void;
};

export const VehicleTypesModal: FC<Props> = (props) => {
	const { data, isVisible, onHide } = props;
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	useEffect(() => {
		if (data) {
			form.setFieldsValue(data);
		}
	}, [data, form]);

	const handleCancel = useCallback(() => {
		onHide();
		form.resetFields();
	}, [form, onHide]);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: VehicleTypePayload) =>
			data ? vehiclesAPI.typeUpdate(data.id, payload) : vehiclesAPI.typeCreate(payload),
		{
			onSuccess: () => {
				handleCancel();
				queryClient.invalidateQueries('vehicleTypes');
				message.success(t(`Vehicle type has been ${data ? 'updated' : 'created'}!`));
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
			title={t(`${data ? 'Update' : 'Create new'} vehicle type`)}
			visible={isVisible}
			footer={false}
			onCancel={handleCancel}
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<Form.Item
					label={'Name'}
					name='name'
					rules={[{ required: true, message: t('Name is required!') }]}
				>
					<Input />
				</Form.Item>
				<Button type='primary' htmlType='submit' loading={isLoading}>
					{t(data ? 'Update' : 'Create')}
				</Button>
			</Form>
		</Modal>
	);
};
