import { Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Card, Col, Form, message, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { TerritoryForm } from './forms/TerritoryForm';

export const SettingsTerritoriesUpdate = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams() as unknown as { id: number };

	const { data, isLoading } = useQuery(
		['settings-locations-territory', id],
		() => settingsAPI.territory(id!),
		{
			staleTime: Infinity,
			cacheTime: 0,
		}
	);
	const handleCancel = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.LOCATIONS_TERRITORY}`);
	}, [navigate]);

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: API.CategoryCreatePayload) => settingsAPI.territoryUpdate(id, values),
		{
			onSuccess: () => {
				navigate(`/dashboard/${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.LOCATIONS_TERRITORY}`);

				message.success(t('Territory has been updated!'));
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
							{t('Edit Territory')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card loading={isLoading}>
					<Row>
						<Col span={24}>
							<Form layout='vertical' size='large' onFinish={handleSubmit} initialValues={data}>
								<TerritoryForm isLoading={isSubmitLoading} onCancel={handleCancel} />
							</Form>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};
