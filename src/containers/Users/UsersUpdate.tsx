import { Typography } from '@/components/atoms';
import { routeNavigate } from '@/routes/utils';
import { Card, Col, Form, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UsersForm } from './UsersForm';

export const UsersUpdate = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

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
							{t('Update user')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Row>
						<Col md={{ span: 12, offset: 6 }}>
							<Form
								layout='vertical'
								size='large'
								onFinish={handleSubmit}
								initialValues={{
									key: '1',
									name: 'More Sailing',
									email: 'gustav.segling@gmail.com',
									role: 'Customer',
									last_login: 'a year ago',
									status: 'Active',
								}}
							>
								<UsersForm onCancel={handleCancel} />
							</Form>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};
