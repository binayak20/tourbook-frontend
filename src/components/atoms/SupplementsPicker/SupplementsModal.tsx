import { SupplementCreateModalMemo } from '@/containers/Supplements/SupplementCreateModal';
import { SupplementCategory } from '@/libs/api/@types';
import { useFormatCurrency } from '@/libs/hooks';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Modal, ModalProps, Row, Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '../Typography';
import { CheckboxGroup } from './styles';

type FormValues = {
	category: number;
	sub_category?: number;
	supplements: number[];
};

export type SupplementsModalProps = {
	modalProps: Omit<ModalProps, 'children'>;
	items?: API.Supplement[];
	categories?: DefaultOptionType[];
	subCategories?: DefaultOptionType[];
	isCategoriesLoading?: boolean;
	isSubCategoriesLoading?: boolean;
	onCategoryChange?: (ID: number) => void;
	onSubCategoryChange?: (ID: number) => void;
	onAdd?: (supplements: API.Supplement[]) => void;
	onCancel?: () => void;
	refetchItems?: () => void;
	currencyCode?: string;
};

export const SupplementsModal: FC<SupplementsModalProps> = (props) => {
	const {
		modalProps,
		items,
		categories,
		subCategories,
		isCategoriesLoading,
		isSubCategoriesLoading,
		onCategoryChange,
		onSubCategoryChange,
		onAdd,
		onCancel,
		refetchItems,
		currencyCode,
	} = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const categoryField = Form.useWatch('category', form);

	useEffect(() => {
		form.setFieldsValue({ sub_category: undefined });
	}, [categoryField, form]);

	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
	const { formatCurrency } = useFormatCurrency(currencyCode);

	const checkboxOptions = useMemo(() => {
		const checkboxItems =
			items?.map(({ id, name, price }) => {
				const label = !isNaN(price) ? (
					<>
						{name}
						<Typography.Text
							type='secondary'
							style={{
								marginLeft: 8,
								fontSize: 14,
								fontWeight: 600,
							}}
						>
							({formatCurrency(price)})
						</Typography.Text>
					</>
				) : (
					name
				);
				return { value: id, label };
			}) || [];

		const addNewItem = {
			value: 0,
			label: (
				<Button
					onClick={() => setIsCreateModalVisible(true)}
					icon={<PlusCircleOutlined />}
					type='link'
				>
					{t('New supplement')}
				</Button>
			),
		};
		return [addNewItem, ...checkboxItems];
	}, [items, t, formatCurrency]);

	const handleCancel = useCallback(() => {
		onCancel?.();
		form.resetFields();
	}, [form, onCancel]);

	const handleSubmit = useCallback(
		(values: FormValues) => {
			const selectedSupplements = items?.filter((supplement) =>
				values.supplements.includes(supplement.id)
			);
			onAdd?.(selectedSupplements || []);
			handleCancel();
		},
		[handleCancel, items, onAdd]
	);

	const selectPickerCategories = useCallback(
		(category?: SupplementCategory) => {
			if (category?.parent === null) {
				form.setFieldsValue({ category: category?.id });
				onCategoryChange?.(category?.id as number);
				return;
			}
			form.setFieldsValue({ category: category?.parent?.id, sub_category: category?.id });
			onSubCategoryChange?.(category?.id as number);
		},
		[onCategoryChange, onSubCategoryChange, form]
	);

	return (
		<Modal width={765} footer={false} centered onCancel={handleCancel} {...modalProps}>
			<Typography.Title type='primary' level={4}>
				{t('Add supplement')}
			</Typography.Title>
			<Typography.Paragraph>
				{t('Select the supplement category & sub-category to select the specific item')}
			</Typography.Paragraph>
			<SupplementCreateModalMemo
				open={isCreateModalVisible}
				data={
					{
						supplement_category: {
							id: form.getFieldValue('sub_category')
								? form.getFieldValue('sub_category')
								: form.getFieldValue('category'),
						} as SupplementCategory,
					} as API.Supplement
				}
				mode={'create'}
				refetchItems={refetchItems}
				onCancel={() => {
					setIsCreateModalVisible(false);
				}}
				selectPickerCategories={selectPickerCategories}
			/>
			<Form form={form} size='large' layout='vertical' onFinish={handleSubmit}>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label={t('Category')}
							name='category'
							rules={[{ required: true, message: t('Category is required!') }]}
						>
							<Select
								placeholder={t('Please choose an option')}
								options={categories}
								loading={isCategoriesLoading}
								onChange={onCategoryChange}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label={t('Sub-Category')} name='sub_category'>
							<Select
								placeholder={t('Please choose an option')}
								options={subCategories}
								loading={isSubCategoriesLoading}
								onChange={onSubCategoryChange}
							/>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					label={`${t('Items')} (${items?.length || 0})`}
					name='supplements'
					valuePropName='checked'
					rules={[{ required: true, message: t('Choosing an item is required!') }]}
				>
					{checkboxOptions?.length ? (
						<CheckboxGroup options={checkboxOptions}>something</CheckboxGroup>
					) : (
						<Typography.Text type='secondary'>
							{t('Please choose some categories to get the supplement list!')}
						</Typography.Text>
					)}
				</Form.Item>
				<Row gutter={16} justify='center'>
					<Col>
						<Button type='default' style={{ minWidth: 120 }} onClick={handleCancel}>
							{t('Cancel')}
						</Button>
					</Col>
					<Col>
						<Button htmlType='submit' type='primary' style={{ minWidth: 120 }}>
							{t('Add')}
						</Button>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};
