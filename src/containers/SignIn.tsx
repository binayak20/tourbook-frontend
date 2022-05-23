import { Typography } from '@/components/atoms';
import { authAPI } from '@/libs/api';
import { useMessage } from '@/libs/hooks';
import { routeNavigate } from '@/routes';
import { auth } from '@/store/actions';
import { ErrorException } from '@/utils';
import { Button, Form, Input, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const SignIn = () => {
	const { t } = useTranslation('signin');
	const { APIRequest } = useMessage('signIn');
	const navigate = useNavigate();
	const { pathname = routeNavigate('dashboard') } = useLocation();

	const handleSubmit = useCallback(
		(values: API.SignInParams) => {
			APIRequest(async () => {
				const { success, data } = await authAPI.signIn(values);
				if (success) {
					auth.authenticate(data);
					navigate(pathname);
					return 'You have successfully signed in';
				}
				throw new ErrorException(data);
			});
		},
		[APIRequest, navigate, pathname]
	);

	return (
		<Form
			name='signIn'
			layout='vertical'
			onFinish={handleSubmit}
			autoComplete='off'
			initialValues={{
				email: 'eve.holt@reqres.in',
				password: 'cityslicka',
			}}
			size='large'
		>
			<Typography.Title level={3} type='primary' style={{ margin: ' 0.5rem 0 2rem 0' }}>
				{t('Sign in to continue')}
			</Typography.Title>

			<Form.Item
				label={t('Email')}
				name='email'
				rules={[
					{ required: true, message: t('Email address is required!') },
					{ type: 'email', message: t('Email address is invalid!') },
				]}
			>
				<Input placeholder={t('Email address')} />
			</Form.Item>

			<Form.Item
				label={t('Password')}
				name='password'
				rules={[{ required: true, message: t('Password is required!') }]}
			>
				<Input.Password placeholder={t('Password')} />
			</Form.Item>
			<Row justify='end' style={{ marginTop: '-1.5rem' }}>
				<Link to={routeNavigate('forgot-password')}>{t('Forgot password?')}</Link>
			</Row>
			<Button block type='primary' htmlType='submit' style={{ marginTop: '0.8rem' }}>
				<Typography.Title noMargin level={5} type='white'>
					{t('Sign In')}
				</Typography.Title>
			</Button>
		</Form>
	);
};
