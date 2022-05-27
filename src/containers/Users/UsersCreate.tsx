import { Button, Typography } from '@/components/atoms';
import { translationKeys } from '@/config/translate/i18next';
import { routeNavigate } from '@/routes/utils';
import { userRoles } from '@/utils/constants';
import { Card, Col, Form, Input, Row, Select } from 'antd';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const UsersCreate = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const userRolesWithTranslations = useMemo(() => {
		return userRoles.map((role) => ({
			...role,
			label: t(role.label as translationKeys),
		}));
	}, [t]);

	const handleCancel = useCallback(() => {
		navigate(routeNavigate('USERS'));
	}, [navigate]);

	const handleSubmit = (values: any) => {
		console.log(values);
	};

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
							<Form layout='vertical' size='large' onFinish={handleSubmit}>
								<Form.Item
									label={t('First Name')}
									name='firstName'
									rules={[{ required: true, message: t('First name is required!') }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									label={t('Last Name')}
									name='lastName'
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
								<Form.Item
									label={t('Role')}
									name='role'
									rules={[{ required: true, message: t('Role is required!') }]}
								>
									<Select size='large' placeholder={t('Choose a role')}>
										{userRolesWithTranslations.map(({ id, value, label }) => (
											<Select.Option key={id} value={value}>
												{label}
											</Select.Option>
										))}
									</Select>
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
