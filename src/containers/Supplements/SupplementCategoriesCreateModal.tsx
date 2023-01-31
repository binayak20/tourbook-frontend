import { supplementsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { Button, Col, Form, Input, message, Modal, ModalProps, Row, Select } from 'antd';
import { FC, memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

type SupplementCategoriesCreateModalProps = Omit<ModalProps, 'onCancel'> & {
	onCancel?: () => void;
	data?: API.SupplementCategory;
	mode?: 'create' | 'update';
};

export const SupplementCategoriesCreateModal: FC<SupplementCategoriesCreateModalProps> = (
	props
) => {
	const { data, mode, onCancel, ...rest } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const queryClient = useQueryClient();

	const handleCancel = useCallback(() => {
		form.resetFields();
		onCancel?.();
	}, [form, onCancel]);

	// Update input values if mode is update
	useEffect(() => {
		if (mode === 'update' && data) {
			form.setFieldsValue({
				...data,
				parent: data.parent?.id,
			});
		}
	}, [data, form, mode]);

	// Get the list of supplement categories
	const { data: categoriesParents, isLoading: isCategoriesLoading } = useQuery(
		['supplementCategoriesParents'],
		() => supplementsAPI.parentCategories({ ...DEFAULT_LIST_PARAMS, is_active: true })
	);

	// Mutate create or update supplement
	const { mutate: handleSubmit, isLoading } = useMutation(
		(payload: API.SupplementCategoryCreatePayload) => {
			if (mode === 'create') {
				return supplementsAPI.createCategory(payload);
			}

			return supplementsAPI.updateCategory(data!.id, payload);
		},
		{
			onMutate: () => {
				if (mode === 'update' && !data?.id) return;
			},
			onSuccess: () => {
				handleCancel();
				queryClient.invalidateQueries('supplementsCategories');
				queryClient.invalidateQueries('supplementCategoriesParents');
				message.success(t(`Supplement category ${mode === 'create' ? 'created' : 'updated'}!`));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Modal
			title={t(`${mode === 'update' ? 'Update' : 'Create'} supplement category`)}
			footer={false}
			maskClosable={false}
			onCancel={handleCancel}
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
				<Form.Item label={t('Parent category')} name='parent'>
					<Select
						allowClear
						loading={isCategoriesLoading}
						options={categoriesParents?.results?.map(({ id, name, is_active }) => ({
							value: id,
							label: name,
							disabled: !is_active,
						}))}
					/>
				</Form.Item>
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

export const SupplementCategoriesCreateModalMemo = memo(SupplementCategoriesCreateModal);
