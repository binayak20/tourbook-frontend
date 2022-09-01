import { Button } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { Category } from '@/libs/api/@types/settings';
import { Col, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
};

export const CategoryForm: FC<Props> = ({ onCancel, saveButtonText, isLoading }) => {
	const { t } = useTranslation();
	const { data: parentCategories } = useQuery(
		'settings-categories-parent',
		() => settingsAPI.parentCategories(),
		{ initialData: [] }
	);

	return (
		<>
			<Form.Item
				label={t('Name')}
				name='name'
				rules={[{ required: true, message: t('Name is required') }]}
			>
				<Input />
			</Form.Item>
			<Form.Item label={t('Parent')} name='parent'>
				<Select allowClear>
					{parentCategories?.map((category: Category) => (
						<Select.Option key={category.id} value={category.id}>
							{category.name}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
			<Row gutter={16}>
				<Col span={12} style={{ textAlign: 'right' }}>
					<Button type='cancel' htmlType='button' onClick={onCancel}>
						{t('Cancel')}
					</Button>
				</Col>
				<Col span={12}>
					<Button type='primary' htmlType='submit' loading={isLoading}>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};
