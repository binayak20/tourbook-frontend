import { Button, Col, Form, Modal, ModalProps, Row, Select } from 'antd';
import { DefaultOptionType } from 'antd/lib/select';
import { FC, useCallback, useEffect, useMemo } from 'react';
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
	} = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const categoryField = Form.useWatch('category', form);

	useEffect(() => {
		form.setFieldsValue({ sub_category: undefined });
	}, [categoryField, form]);

	const checkboxOptions = useMemo(() => {
		return (
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
							({price} SEK)
						</Typography.Text>
					</>
				) : (
					name
				);
				return { value: id, label };
			}) || []
		);
	}, [items]);

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

	return (
		<Modal width={765} footer={false} centered onCancel={handleCancel} {...modalProps}>
			<Typography.Title type='primary' level={4}>
				{t('Add supplement')}
			</Typography.Title>
			<Typography.Paragraph>
				{t('Select the supplement category & sub-category to select the specific item')}
			</Typography.Paragraph>

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
					{items?.length ? (
						<CheckboxGroup options={checkboxOptions} />
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
