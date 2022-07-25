import { Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { Card, Col, Form, message, Row } from 'antd';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { RolesForm } from './RolesForm';

export const SettingsUserRoleCreate = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [permissions, setPermissions] = useState<number[]>([]);
	const navigate = useNavigate();

	const navigateToList = useCallback(() => {
		navigate(`/dashboard/${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USER_ROLES}/`);
	}, [navigate]);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: { name: string }) => settingsAPI.createUserRole({ ...values, permissions }),
		{
			onSuccess: () => {
				queryClient.prefetchQuery('settings-user-roles', () => settingsAPI.userRoles());
				message.success(t('Role has been created!'));
				navigateToList();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handlePermission = (values: API.Permission) => {
		setPermissions((prev) => {
			const newPermissions = [...prev];
			if (newPermissions.includes(values.id)) {
				newPermissions.splice(newPermissions.indexOf(values.id), 1);
			} else {
				newPermissions.push(values.id);
			}

			return newPermissions;
		});
	};
	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Create New Role')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Form layout='vertical' size='large' onFinish={handleSubmit}>
						<RolesForm
							isLoading={isLoading}
							onCancel={() => navigateToList()}
							selectedItems={permissions}
							onItemChange={handlePermission}
							saveButtonText={t('Save')}
						/>
					</Form>
				</Card>
			</Col>
		</Row>
	);
};
