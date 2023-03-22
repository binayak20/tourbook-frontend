import { supplementsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import {
	Button,
	Checkbox,
	Col,
	Form,
	Input,
	InputNumber,
	message,
	Modal,
	ModalProps,
	Row,
	Select,
} from 'antd';
import { FC, memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type SupplementCreateModalProps = Omit<ModalProps, 'onCancel'> & {
	onCancel?: () => void;
	data?: API.Supplement;
	mode?: 'create' | 'update';
	refetchItems?: () => void;
};

export const SupplementCreateModal: FC<SupplementCreateModalProps> = (props) => {
	const { data, mode, onCancel, refetchItems, ...rest } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	const unitTypeOptions = [
		{ value: 'per_booking', label: t('Per Booking') },
		{ value: 'per_day', label: t('Per Day') },
		{ value: 'per_week', label: t('Per Week') },
		{ value: 'per_night', label: t('Per Night') },
		{ value: 'per_booking_person', label: t('Per Booking Person') },
		{ value: 'per_day_person', label: t('Per Day Person') },
		{ value: 'per_week_person', label: t('Per Week Person') },
		{ value: 'per_night_person', label: t('Per Night Person') },
	];

	const handleCancel = useCallback(() => {
		form.resetFields();
		onCancel?.();
	}, [form, onCancel]);

	// Update input values if mode is update
	useEffect(() => {
		if (data) {
			form.setFieldsValue({
				...data,
				supplement_category: data.supplement_category.id,
			});
		}
	}, [data, form, mode]);

	// Get the list of supplement categories
	const { data: categories, isLoading: isCategoriesLoading } = useQuery(
		['supplementCategories'],
		() => supplementsAPI.categories({ ...DEFAULT_LIST_PARAMS, is_active: true })
	);

	// Mutate create or update supplement
	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: API.SupplementCreatePayload) => {
			if (mode === 'create') {
				return supplementsAPI.create(payload);
			}

			return supplementsAPI.update(data!.id, payload);
		},
		{
			onMutate: () => {
				if (mode === 'update' && !data?.id) return;
			},
			onSuccess: () => {
				handleCancel();
				refetchItems?.();
				console.log(refetchItems);
				queryClient.invalidateQueries('supplements');
				message.success(t(`Supplement ${mode === 'create' ? 'created' : 'updated'} successfully!`));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Modal
			title={t(mode === 'update' ? 'Update supplement' : 'Create supplement')}
			footer={false}
			maskClosable={false}
			onCancel={handleCancel}
			width={700}
			{...rest}
		>
			<Form
				form={form}
				size='large'
				layout='vertical'
				onFinish={handleSubmit}
				initialValues={{
					is_calculate: true,
				}}
			>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label={t('Name')}
							name='name'
							rules={[{ required: true, message: t('Name is required!') }]}
						>
							<Input />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={t('Unit type')}
							name='unit_type'
							rules={[{ required: true, message: t('Unit type is required!') }]}
						>
							<Select options={unitTypeOptions} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label={t('Price')}
							name='price'
							rules={[{ required: true, message: t('Price is required!') }]}
						>
							<InputNumber min={0} style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label={t('Quantity')} name='quantity'>
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label={t('Category')}
							name='supplement_category'
							rules={[{ required: true, message: t('Category is required!') }]}
						>
							<Select
								loading={isCategoriesLoading}
								options={categories?.results?.map(({ id, name }) => ({ value: id, label: name }))}
								placeholder={t('Choose an option')}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label={t('Description')} name='description'>
							<Input.TextArea rows={3} placeholder={t('Write text here...')} />
						</Form.Item>
					</Col>
					<Col>
						<Form.Item name='is_mandatory' valuePropName='checked'>
							<Checkbox>{t('Mark as mandatory')}</Checkbox>
						</Form.Item>
					</Col>
					<Col>
						<Form.Item name='is_calculate' valuePropName='checked'>
							<Checkbox>{t('Mark as calculated')}</Checkbox>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16} justify='center'>
					<Col>
						<Button type='default' style={{ minWidth: 120 }} onClick={handleCancel}>
							{t('Cancel')}
						</Button>
					</Col>
					<Col>
						<Button htmlType='submit' type='primary' style={{ minWidth: 120 }} loading={isLoading}>
							{t(mode === 'update' ? 'Update' : 'Create')}
						</Button>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export const SupplementCreateModalMemo = memo(SupplementCreateModal);
