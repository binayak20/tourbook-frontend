import { Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { Card, Col, Form, message, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { TerritoryForm } from './forms/TerritoryForm';

export const SettingsTerritoriesCreate = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleCancel = useCallback(() => {
		navigate(`./../`);
	}, [navigate]);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.TerritoryCreateUpdatePayload) => settingsAPI.territoryCreate(values),
		{
			onSuccess: () => {
				navigate(`./../`);
				message.success(t('Territory has been created!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Create New Territory')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Row>
						<Col span={24}>
							<Form layout='vertical' size='large' onFinish={handleSubmit}>
								<TerritoryForm isLoading={isLoading} onCancel={handleCancel} />
							</Form>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};
