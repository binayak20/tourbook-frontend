import { Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Card, Col, Form, message, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ConfigurationForm } from './forms/ConfigurationForm';

export const SettingsConfiguration = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [form] = Form.useForm();

	const { data, isLoading: isConfigurationLoading } = useQuery(
		'settings-configuration',
		() => settingsAPI.configurations(),
		{
			staleTime: Infinity,
			cacheTime: 0,
		}
	);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.Configuration) =>
			settingsAPI.updateConfigurations({
				...values,
				logo: '',
				favicon: '',
				login_page_bg_image: '',
			}),
		{
			onSuccess: () => {
				navigate(`/dashboard/${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.CONFIGURATION}`);
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
								initialValues={data}
							>
								<ConfigurationForm isLoading={isLoading} onCancel={() => form.resetFields()} />
							</Form>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};
