import { Button } from '@/components/atoms';
import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
};

export const TagForm: FC<Props> = ({ onCancel, saveButtonText, isLoading }) => {
	const { t } = useTranslation();

	return (
		<>
			<Form.Item
				label={t('Name')}
				name='name'
				rules={[{ required: true, message: t('Name is required') }]}
			>
				<Input />
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
