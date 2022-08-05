import { Button } from '@/components/atoms';
import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
	resetFields?: () => void;
};

export const AccommodationForm: FC<Props> = ({ onCancel, saveButtonText, isLoading }) => {
	const { t } = useTranslation();

	return (
		<>
			<Row gutter={40}>
				<Col lg={12}>
					<Form.Item
						label={t('Name')}
						name='name'
						rules={[{ required: true, message: t('Name is required') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12}>
					<Form.Item
						label={t('Address')}
						name='address'
						rules={[{ required: true, message: t('Address code is required') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12}>
					<Form.Item
						label={t('Website')}
						name='website_url'
						// rules={[{ required: true, message: t('Transfer cost is required') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col span={24}>
					<Form.Item label={t('Description')} name='description'>
						<Input.TextArea rows={5} />
					</Form.Item>
				</Col>
			</Row>
			<Row align='middle' justify='center'>
				<Col span={3}>
					<Button block type='cancel' htmlType='button' onClick={onCancel}>
						{t('Cancel')}
					</Button>
				</Col>
				<Col span={3} className='margin-4'>
					<Button block type='primary' htmlType='submit' loading={isLoading}>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};
