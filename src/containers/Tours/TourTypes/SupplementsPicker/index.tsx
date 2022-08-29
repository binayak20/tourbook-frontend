import { Button, Typography } from '@/components/atoms';
import { supplementsAPI } from '@/libs/api';
import { PlusCircleFilled } from '@ant-design/icons';
import { Col, Form, Modal, Row, Select } from 'antd';
import { FC, Fragment, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { PickedList, PickedListProps } from './PickedList';
import { CheckboxGroup } from './styles';

type SupplementsPickerProps = Omit<PickedListProps, 'children'> & {
	onSubmit: (supplements: API.Supplement[]) => void;
};

type FormValues = {
	category: number;
	sub_category?: number;
	supplements: number[];
};

export const SupplementsPicker: FC<SupplementsPickerProps> = ({ onSubmit, ...rest }) => {
	const [isModalVisible, setModalVisible] = useState(false);
	const [supplements, setSupplements] = useState<API.Supplement[]>([]);
	const { t } = useTranslation();
	const [form] = Form.useForm();

	const { data: categories, isLoading: isCategoriesLoading } = useQuery(
		['supplementCategories'],
		() => supplementsAPI.categories()
	);

	const {
		mutate: mutateSubCategories,
		isLoading: isSubCategoriesLoading,
		data: subCategories,
	} = useMutation((ID: number) => supplementsAPI.subCategories(ID));

	const { mutate: mutateSupplements } = useMutation(
		(categoryID: number) => supplementsAPI.list({ supplement_category: categoryID }),
		{
			onSuccess: (data) => {
				setSupplements(data || []);
			},
		}
	);

	const handleCancel = useCallback(() => {
		setModalVisible(false);
		setSupplements([]);
		form.resetFields();
	}, [form]);

	const handleCategoryChange = useCallback(
		(ID: number) => {
			form.resetFields(['sub_category', 'items']);
			mutateSupplements(ID);
			mutateSubCategories(ID);
		},
		[form, mutateSubCategories, mutateSupplements]
	);

	const handleSubCategoryChange = useCallback(
		(ID: number) => {
			mutateSupplements(ID);
		},
		[mutateSupplements]
	);

	const handleSubmit = useCallback(
		(values: FormValues) => {
			const selectedSupplements = supplements.filter((supplement) =>
				values.supplements.includes(supplement.id)
			);
			onSubmit(selectedSupplements);
			handleCancel();
		},
		[handleCancel, onSubmit, supplements]
	);

	return (
		<Fragment>
			<Typography.Title type='primary' level={5}>
				{t('Supplements Included')}
			</Typography.Title>

			<PickedList {...rest}>
				<Button
					type='primary'
					size='large'
					icon={<PlusCircleFilled />}
					onClick={() => setModalVisible(true)}
				>
					{t('Add supplement')}
				</Button>
			</PickedList>

			<Modal width={765} footer={false} visible={isModalVisible} onCancel={handleCancel}>
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
									options={categories?.results?.map(({ id, name }) => ({ label: name, value: id }))}
									loading={isCategoriesLoading}
									onChange={handleCategoryChange}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label={t('Sub-Category')} name='sub_category'>
								<Select
									placeholder={t('Please choose an option')}
									options={subCategories?.map(({ id, name }) => ({ label: name, value: id }))}
									loading={isSubCategoriesLoading}
									onChange={handleSubCategoryChange}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item
						label={t('Items')}
						name='supplements'
						valuePropName='checked'
						rules={[{ required: true, message: t('Supplements is required!') }]}
					>
						{supplements?.length ? (
							<CheckboxGroup
								options={supplements?.map(({ id, name }) => ({ label: name, value: id }))}
							/>
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
		</Fragment>
	);
};
