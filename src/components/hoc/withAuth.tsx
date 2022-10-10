import { settingsAPI, usersAPI } from '@/libs/api';
import { useAuth } from '@/libs/auth';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { appActions, authActions } from '@/store/actions';
import { ComponentType } from 'react';
import { AccessProvider } from 'react-access-boundary';
import { useQuery } from 'react-query';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from '../atoms';

export const withAuth = <T extends object>(WrappedComponent: ComponentType<T>) => {
	return (props: T) => {
		const location = useLocation();
		const { isAuthenticated } = useAuth();
		const { user, permissions } = useStoreSelector((state) => state.auth);
		const dispatch = useStoreDispatch();

		const { isLoading } = useQuery('profile', () => usersAPI.profile(), {
			enabled: isAuthenticated && !user,
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

		useQuery('settings-configurations', () => settingsAPI.configurations(), {
			onSuccess: (data) => {
				dispatch(appActions.updateCurrency(data.default_currency as unknown as number));
			},
		});

		if (isLoading) {
			return <Spin type='content-centre' size='large' />;
		}

		if (!isAuthenticated) {
			return <Navigate to='/' state={{ from: location }} />;
		}

		return (
			<AccessProvider permissions={permissions}>
				<WrappedComponent {...props} />
			</AccessProvider>
		);
	};
};
