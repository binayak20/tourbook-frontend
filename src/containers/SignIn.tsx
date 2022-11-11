import { Brand, Typography } from '@/components/atoms';
import { authAPI } from '@/libs/api';
import { authService } from '@/libs/auth';
import { Button, Col, Form, Input, message, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export const SignIn = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { pathname = 'dashboard', state } = useLocation();

	const { mutate: handleSubmit, isLoading } = useMutation(
		(values: API.LoginPayload) => authAPI.login(values),
		{
			onSuccess: ({ auth_token }) => {
				navigate((state as string) || pathname);
				authService.setToken(auth_token);
				message.success(t('You have successfully signed in!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return (
		<Form name='signIn' layout='vertical' onFinish={handleSubmit} autoComplete='off' size='large'>
			<FormHeader>
				<Brand />
				<Typography.Title level={3} type='primary' noMargin>
					{t('Sign in')}
				</Typography.Title>
				<Typography.Text>{t("It's so nice to see you")}</Typography.Text>
			</FormHeader>

			<Form.Item
				label={t('Email')}
				name='email'
				rules={[
					{ required: true, message: t('Email address is required!') },
					{ type: 'email', message: t('Email address is invalid!') },
				]}
			>
				<Input placeholder={t('Email Address')} />
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
					<Link to='forgot-password'>{t('Forgot password?')}</Link>
				</Col>
				<Col xs={12}>
					<Button htmlType='submit' block type='primary' loading={isLoading}>
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
		font-size: 1.125rem;
	}
`;
