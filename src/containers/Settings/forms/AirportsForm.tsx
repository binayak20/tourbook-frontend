import { Button } from '@/components/atoms';
import { Col, Form, Input, Row } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
};

export const AirportsForm: FC<Props> = ({ onCancel, saveButtonText, isLoading }) => {
	const { t } = useTranslation();

	return (
		<>
			<Row gutter={40}>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Name')}
						name='name'
						rules={[{ required: true, message: t('Name is required') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Airport Code')}
						name='airport_code'
						rules={[{ required: true, message: t('Airport code is required') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Transfer cost')}
						name='transfer_cost'
						// rules={[{ required: true, message: t('Transfer cost is required') }]}
					>
						<Input type='number' min={0} />
					</Form.Item>
				</Col>
				<Col lg={12} xl={8}>
					<Form.Item
						label={t('Additional transfer cost')}
						name='additional_transfer_cost'
						// rules={[{ required: true, message: t('Additional transfer cost is required') }]}
					>
						<Input type='number' min={0} />
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
