import config from '@/config';
import { fortnoxAPI } from '@/libs/api';
import { useStoreSelector } from '@/store';
import { message } from 'antd';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

export const useConfigureFortnox = () => {
	const { t } = useTranslation();
	const { search } = useLocation();
	const { fortnox } = useStoreSelector((state) => state.app);
	const navigate = useNavigate();

	const constructedURL = useMemo(() => {
		const {
			fortnox_client_id,
			fortnox_scope,
			fortnox_state,
			fortnox_access_type,
			fortnox_response_type,
			fortnox_account_type,
		} = fortnox || {};

		if (fortnox_client_id && fortnox_scope && fortnox_state && fortnox_response_type) {
			const url = new URL(config.fortnoxURL);
			url.searchParams.append('client_id', fortnox_client_id);
			url.searchParams.append('redirect_uri', window.location.href);
			url.searchParams.append('scope', fortnox_scope);
			url.searchParams.append('state', fortnox_state);
			if (fortnox_access_type) {
				url.searchParams.append('access_type', fortnox_access_type);
			}
			url.searchParams.append('response_type', fortnox_response_type);
			if (fortnox_account_type) {
				url.searchParams.append('account_type', fortnox_account_type);
			}

			return url.toString();
		}

		return null;
	}, [fortnox]);

	const { mutate } = useMutation((payload: Record<string, string>) => fortnoxAPI.config(payload), {
		onSuccess: () => {
			message.success('Successfully configured');
			navigate('/dashboard/settings/accounting-configure');
		},
	});

	useEffect(() => {
		const params = new URLSearchParams(search);

		if (params?.toString() && constructedURL) {
			mutate({ ...Object.fromEntries(params), request_url: constructedURL });
		}
	}, [search, mutate, constructedURL, navigate]);

	const handleConfigureFortnox = useCallback(() => {
		if (constructedURL) {
			window.location.href = constructedURL;
		} else {
			message.error(t('Fortnox configuration is missing!'));
		}
	}, [constructedURL, t]);

	return { handleConfigureFortnox };
};
