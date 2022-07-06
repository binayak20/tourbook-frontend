import { Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { Card, Col, Form, message, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryForm } from './forms/CategoryForm';

export const SettingsCategoriesUpdate = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams() as unknown as { id: number };

	const { data, isLoading } = useQuery(['settings-category', id], () => settingsAPI.category(id!), {
		staleTime: Infinity,
		cacheTime: 0,
	});
	const handleCancel = useCallback(() => {
		navigate(`./../`);
	}, [navigate]);

	const { mutate: handleSubmit, isLoading: isSubmitLoading } = useMutation(
		(values: API.CategoryCreatePayload) => settingsAPI.categoryUpdate(id, values),
		{
			onSuccess: () => {
				navigate(`./../`);
				message.success(t('Category has been updated!'));
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
							{t('Edit Category')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card loading={isLoading}>
					<Row>
						<Col span={24}>
							<Form layout='vertical' size='large' onFinish={handleSubmit} initialValues={data}>
								<CategoryForm isLoading={isSubmitLoading} onCancel={handleCancel} />
							</Form>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};
