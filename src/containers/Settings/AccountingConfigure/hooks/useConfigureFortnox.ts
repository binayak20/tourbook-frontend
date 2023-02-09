import { fortnoxAPI } from '@/libs/api';
import { message } from 'antd';
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { useLocation } from 'react-router-dom';

export const useConfigureFortnox = () => {
	const { search } = useLocation();

	const { mutate } = useMutation(
		(payload: { request_body: string; response_body: string; request_url: string }) => {
			return fortnoxAPI.config(payload);
		},
		{
			onSuccess: () => {
				message.success('Successfully configured');
			},
		}
	);

	useEffect(() => {
		const params = new URLSearchParams(search);
		const request_body = params.get('request_body');
		const response_body = params.get('response_body');
		const request_url = params.get('request_url');

		if (request_body && response_body && request_url) {
			mutate({ request_body, response_body, request_url });
		}
	}, [search, mutate]);
};
