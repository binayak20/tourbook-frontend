import { Brand, Typography } from '@/components/atoms';
import { authAPI } from '@/libs/api';
import { useMessage } from '@/libs/hooks';
import { routeNavigate } from '@/routes';
import { auth } from '@/store/actions';
import { ErrorException } from '@/utils';
import { Button, Col, Form, Input, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
			<FormHeader>
				<Brand />
				<Typography.Title level={3} type='primary' noMargin>
					{t('Sign in')}
				</Typography.Title>
				<Typography.Text>It&rsquo;s so nice to see you</Typography.Text>
			</FormHeader>

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
			<Row gutter={16} align='middle'>
				<Col xs={12}>
					<Link to={routeNavigate('forgot-password')}>{t('Forgot password?')}</Link>
				</Col>
				<Col xs={12}>
					<Button block type='primary' htmlType='submit'>
						{t('Sign in')}
					</Button>
				</Col>
			</Row>
		</Form>
	);
};

export const FormHeader = styled.div`
	width: 100%;
	display: block;
	text-align: center;
	margin-bottom: 2rem;

	& > h3.ant-typography {
		margin-top: 1rem;
	}

	& > span.ant-typography {
		font-size: 1rem;
		color: ${({ theme }) => theme.colors.text};
	}
`;
