import { Typography } from '@/components/atoms';
import { settingsAPI, usersAPI } from '@/libs/api';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { authActions } from '@/store/actions';
import { Card, Col, Form, message, Row } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { RolesForm } from './RolesForm';

export const SettingsUserRoleUpdate = () => {
	const [permissions, setPermissions] = useState<number[]>([]);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { id } = useParams() as unknown as { id: number };
	const { user } = useStoreSelector((state) => state.auth);
	const dispatch = useStoreDispatch();

	const { data } = useQuery(['role'], () => settingsAPI.userRole(id!), {
		enabled: !!id,
		cacheTime: 0,
	});

	const prevSelectedItems = useMemo(() => {
		const { permissions: dataPermissions, hidden_permissions } = data || {};
		if (dataPermissions?.length) {
			return dataPermissions.reduce((acc, permission) => {
				if (!hidden_permissions?.includes(permission)) {
					acc.push(permission);
				}
				return acc;
			}, [] as number[]);
		}
		return [];
	}, [data]);

	const isCurrentUser = useMemo(() => {
		if (user?.groups?.length) {
			return user.groups.some((group) => group.id === parseInt(id as unknown as string, 10));
		}

		return false;
	}, [id, user]);

	const { mutate: updateLoggedUser } = useMutation(['profile'], () => usersAPI.profile(), {
		onSuccess: (data) => {
			if (data && Object.entries(data).length) {
				dispatch(authActions.setUser(data));

				if (data?.permissions?.length) {
					const authPermissions = data.permissions.reduce((acc, curr) => {
						acc.push(curr.codename.toUpperCase());
						return acc;
					}, [] as string[]);

					dispatch(authActions.setPermissions(authPermissions));
				}
			}
		},
	});

	const handleCancel = useCallback(() => {
		navigate(-1);
	}, [navigate]);

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: { name: string }) => settingsAPI.updateUserRole(id, { ...values, permissions }),
		{
			onSuccess: () => {
				if (isCurrentUser) {
					updateLoggedUser();
				}

				navigate(-1);
				message.success(t('Role has been updated!'));
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
							{t('Update Role')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					{data && (
						<Form
							layout='vertical'
							size='large'
							onFinish={handleSubmit}
							initialValues={{
								name: data.name,
							}}
						>
							<RolesForm
								isLoading={isLoading}
								selectedItems={prevSelectedItems}
								onPermissionChange={setPermissions}
								saveButtonText={t('Save')}
								onCancel={handleCancel}
							/>
						</Form>
					)}
				</Card>
			</Col>
		</Row>
	);
};
