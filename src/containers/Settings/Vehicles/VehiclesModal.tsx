import { vehiclesAPI } from '@/libs/api';
import { Vehicle, VehicleType } from '@/libs/api/@types';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type Props = {
	data?: VehicleType;
	isVisible: boolean;
	onHide: () => void;
};

export const VehiclesModal: FC<Props> = (props) => {
	const { data, isVisible, onHide } = props;
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [form] = Form.useForm();

	const { isLoading: vehicleTypesLoading, data: vehicleTypes } = useQuery('vehicleTypes', () =>
		vehiclesAPI.types(DEFAULT_LIST_PARAMS)
	);

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
		(payload: Vehicle) =>
			data ? vehiclesAPI.update(data.id, payload) : vehiclesAPI.create(payload),
		{
			onSuccess: () => {
				handleCancel();
				queryClient.invalidateQueries('vehicles');
				message.success(t(`Vehicle has been ${data ? 'updated' : 'created'}!`));
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
			title={t(`${data ? 'Update' : 'Create new'} vehicle`)}
			open={isVisible}
			footer={false}
			onCancel={handleCancel}
		>
			<Form form={form} layout='vertical' size='large' onFinish={handleSubmit}>
				<Form.Item
					label={t('Name')}
					name='name'
					rules={[{ required: true, message: t('Name is required!') }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={t('Vehicle type')}
					name='vehicle_type'
					rules={[{ required: true, message: t('Vehicle type is required!') }]}
				>
					<Select
						loading={vehicleTypesLoading}
						placeholder={t('Please choose an option')}
						options={vehicleTypes?.results?.map((vehicleType) => ({
							value: vehicleType?.id,
							label: vehicleType?.name,
							disbaled: vehicleType?.is_active,
						}))}
					/>
				</Form.Item>
				<Form.Item
					label={t('Capacity')}
					name='capacity'
					rules={[{ required: true, message: t('Capacity is required!') }]}
				>
					<Input min={1} type='number' />
				</Form.Item>
				<Form.Item name='description' label={t('Description')}>
					<Input.TextArea />
				</Form.Item>
				<Button type='primary' htmlType='submit' loading={isLoading}>
					{t(data ? 'Update' : 'Create')}
				</Button>
			</Form>
		</Modal>
	);
};
