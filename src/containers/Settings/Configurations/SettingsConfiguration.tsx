import { Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { Configuration } from '@/libs/api/@types/settings';
import { useStoreDispatch } from '@/store';
import { appActions } from '@/store/actions';
import { Card, Col, Form, message, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { ConfigurationForm } from './ConfigurationForm';

export const SettingsConfiguration = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const dispatch = useStoreDispatch();

	const {
		data,
		isLoading: isConfigurationLoading,
		refetch,
	} = useQuery('settings-configurations', () => settingsAPI.configurations(), {
		cacheTime: 0,
	});

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: Configuration) => settingsAPI.updateConfigurations(values),
		{
			onSuccess: (data) => {
				refetch();
				if (data?.color_code) {
					dispatch(appActions.updatePrimaryColor(data?.color_code));
				}
				if (data?.booking_fee) {
					dispatch(appActions.updateMinBookingFee(data?.booking_fee));
				}
				message.success(t('Configuration has been updated!'));
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
							{t('Edit Configuration')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card loading={isConfigurationLoading}>
					<Row>
						<Col span={24}>
							<Form
								form={form}
								layout='vertical'
								size='large'
								onFinish={handleSubmit}
								initialValues={{
									...data,
									email_provider: data?.email_provider?.id,
									accounting_service_provider: data?.accounting_service_provider?.id,
								}}
							>
								<ConfigurationForm isLoading={isLoading} form={form} />
							</Form>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};
