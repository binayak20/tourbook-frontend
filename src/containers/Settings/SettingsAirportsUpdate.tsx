import { Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { routeNavigate } from '@/routes/utils';
import { Card, Col, Form, message, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { AirportsForm } from './forms/AirportsForm';

export const SettingsAirportsUpdate = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams() as unknown as { id: number };

	const { data } = useQuery('settings-airport', () => settingsAPI.airport(id!), {
		enabled: !!id,
		cacheTime: 0,
	});

	const handleCancel = useCallback(() => {
		navigate(routeNavigate(['SETTINGS', 'AIRPORTS']));
	}, [navigate]);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.AirportUpdatePayload) => settingsAPI.airportUpdate(id, values),
		{
			onSuccess: ({ success, message: error }) => {
				if (!success) {
					throw new Error(error);
				}

				navigate(routeNavigate(['SETTINGS', 'AIRPORTS']));
				message.success(t('Airport has been updated!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	console.log(data?.data);
	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Create New Airport')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Row>
						<Col span={24}>
							{data?.data && (
								<Form
									layout='vertical'
									size='large'
									onFinish={handleSubmit}
									initialValues={data.data}
								>
									<AirportsForm isLoading={isLoading} onCancel={handleCancel} />
								</Form>
							)}
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};
