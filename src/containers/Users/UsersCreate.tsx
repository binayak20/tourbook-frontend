import { Button, Typography } from '@/components/atoms';
import { routeNavigate } from '@/routes';
import { Card, Col, Form, Input, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const UsersCreate = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleCancel = useCallback(() => {
		navigate(routeNavigate('dashboard/users'));
	}, [navigate]);

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Create New User')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Row>
						<Col md={{ span: 12, offset: 6 }}>
							<Form layout='vertical' size='large'>
								<Form.Item
									label={t('First Name')}
									name='text'
									rules={[{ required: true, message: t('First name is required!') }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									label={t('Last Name')}
									name='text'
									rules={[{ required: true, message: t('Last name is required!') }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									label={t('Email Address')}
									name='email'
									rules={[
										{ required: true, message: t('Email address is required!') },
										{ type: 'email', message: t('Email address is invalid!') },
									]}
								>
									<Input />
								</Form.Item>
								<Row gutter={16} align='middle'>
									<Col xs={12}>
										<Button block type='cancel' htmlType='button' onClick={handleCancel}>
											{t('Cancel')}
										</Button>
									</Col>
									<Col xs={12}>
										<Button block type='primary' htmlType='submit'>
											{t('Save')}
										</Button>
									</Col>
								</Row>
							</Form>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};
