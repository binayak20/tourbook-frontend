import { supplementsAPI } from '@/libs/api';
import { Button, Col, Form, Input, InputNumber, Modal, ModalProps, Row, Select } from 'antd';
import { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type SupplementCreateModalProps = Omit<ModalProps, 'onCancel'> & {
	onCancel?: () => void;
	data?: API.Supplement;
	mode?: 'create' | 'update';
};

export const SupplementCreateModal: FC<SupplementCreateModalProps> = (props) => {
	const { data, mode, ...rest } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (mode === 'update' && data) {
			form.setFieldsValue({
				...data,
				supplement_category: data.supplement_category.id,
			});
		}
	}, [data, form, mode]);

	const { data: categories, isLoading } = useQuery(['supplementCategories'], () =>
		supplementsAPI.categories()
	);

	const { mutate: mutateCreate, isLoading: isCreateLoading } = useMutation(
		(payload: API.SupplementCreatePayload) => supplementsAPI.create(payload),
		{
			onSuccess: () => {
				form.resetFields();
				rest.onCancel?.();
				queryClient.invalidateQueries('supplements');
			},
		}
	);

	const { mutate: mutateUpdate, isLoading: isUpdateLoading } = useMutation(
		(payload: API.SupplementUpdatePayload) => supplementsAPI.update(data!.id, payload),
		{
			onMutate: () => {
				if (!data) return;
			},
			onSuccess: () => {
				form.resetFields();
				rest.onCancel?.();
				queryClient.invalidateQueries('supplements');
			},
		}
	);

	const handleSubmit = useCallback(
		(values: API.SupplementCreatePayload) => {
			if (mode === 'create') {
				mutateCreate(values);
			} else {
				mutateUpdate(values);
			}
		},
		[mode, mutateCreate, mutateUpdate]
	);

	return (
		<Modal
			title={t(mode === 'update' ? 'Update supplement' : 'Create supplement')}
			footer={false}
			maskClosable={false}
			{...rest}
		>
			<Form form={form} size='large' layout='vertical' onFinish={handleSubmit}>
				<Form.Item
					label={t('Name')}
					name='name'
					rules={[{ required: true, message: t('Name is required!') }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label={t('Price')}
					name='price'
					rules={[{ required: true, message: t('Price is required!') }]}
				>
					<InputNumber min={0} style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					label={t('Category')}
					name='supplement_category'
					rules={[{ required: true, message: t('Category is required!') }]}
				>
					<Select
						loading={isLoading}
						options={categories?.map(({ id, name }) => ({ value: id, label: name }))}
					/>
				</Form.Item>
				<Row gutter={16} justify='center'>
					<Col>
						<Button type='default' style={{ minWidth: 120 }} onClick={rest.onCancel}>
							{t('Cancel')}
						</Button>
					</Col>
					<Col>
						<Button
							htmlType='submit'
							type='primary'
							style={{ minWidth: 120 }}
							loading={isCreateLoading || isUpdateLoading}
						>
							{t(mode === 'update' ? 'Update' : 'Create')}
						</Button>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};
