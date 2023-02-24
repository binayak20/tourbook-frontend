import { settingsAPI, usersAPI } from '@/libs/api';
import { useAuth } from '@/libs/auth';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { appActions, authActions } from '@/store/actions';
import { ConfigProvider } from 'antd';
import { ComponentType, useEffect } from 'react';
import { AccessProvider } from 'react-access-boundary';
import { useQuery } from 'react-query';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from '../atoms';

export const withAuth = <T extends object>(WrappedComponent: ComponentType<T>) => {
	return (props: T) => {
		const location = useLocation();
		const { isAuthenticated } = useAuth();
		const { user, permissions } = useStoreSelector((state) => state.auth);
		const { primaryColor } = useStoreSelector((state) => state.app);
		const dispatch = useStoreDispatch();

		useEffect(() => {
			if (primaryColor) {
				ConfigProvider.config({ theme: { primaryColor } });
			}
		}, [primaryColor]);

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
				const {
					fortnox_client_id,
					fortnox_client_credentials,
					fortnox_scope,
					fortnox_state,
					fortnox_access_type,
					fortnox_account_type,
					fortnox_response_type,
				} = data;
				dispatch(
					appActions.updateFortnox({
						fortnox_client_id,
						fortnox_client_credentials,
						fortnox_scope,
						fortnox_state,
						fortnox_access_type,
						fortnox_account_type,
						fortnox_response_type,
					})
				);

				if (data?.default_currency_id) {
					dispatch(appActions.updateCurrency(data.default_currency_id));
				}
				if (data?.color_code) {
					dispatch(appActions.updatePrimaryColor(data.color_code));
				}
				if (data?.booking_fee) {
					dispatch(appActions.updateMinBookingFee(data.booking_fee));
				}
				if (data?.bank_giro_number) {
					dispatch(appActions.updateBankGiro(data.bank_giro_number));
				}
			},
		});

		if (isLoading) {
			return <Spin type='content-centre' size='large' />;
		}

		if (!isAuthenticated) {
			return <Navigate to='/' state={location} />;
		}

		return (
			<AccessProvider permissions={permissions}>
				<WrappedComponent {...props} />
			</AccessProvider>
		);
	};
};
