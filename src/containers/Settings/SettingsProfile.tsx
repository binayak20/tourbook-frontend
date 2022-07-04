import { Button, Switch, Typography } from '@/components/atoms';
import { hexToRGB } from '@/utils/helpers';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Form, Input, Row, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

export const SettingsProfile = () => {
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const { t } = useTranslation();
	const { search } = useLocation();

	useEffect(() => {
		if (search.includes('type=password')) {
			setIsPasswordVisible(true);
		} else {
			setIsPasswordVisible(false);
		}
	}, [search]);

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Your profile')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Row>
						<Col md={{ span: 12, offset: 6 }}>
							<Form layout='vertical' size='large'>
								{/* <UsersForm onCancel={handleCancel} /> */}
								<Form.Item
									label={t('Display picture')}
									name='avatar'
									valuePropName='filelist'
									className='dp-upload'
								>
									<AvatarUpload
										multiple={false}
										customRequest={(): void => {
											return;
										}}
										showUploadList={false}
									>
										<Avatar shape='circle' size={120} icon={<UserOutlined />} />
										{/* <UserAvatar src={imgUrl} size={120} icon={<UserOutlined />} /> */}
									</AvatarUpload>
								</Form.Item>
								<Form.Item
									label={t('First Name')}
									name='firstName'
									rules={[{ required: true, message: t('First name is required!') }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									label={t('Last Name')}
									name='lastName'
									rules={[{ required: true, message: t('Last name is required!') }]}
								>
									<Input />
								</Form.Item>
								<Form.Item
									label={t('Email Address')}
									name='email'
									rules={[
										{ required: true, message: t('Email address is required!') },
										{ type: 'email', message: t('Email address is invalid!') },
									]}
								>
									<Input />
								</Form.Item>
								<Form.Item label={t('Reset Password?')}>
									<Switch
										custom
										checked={isPasswordVisible}
										onChange={() => setIsPasswordVisible((prev) => !prev)}
										checkedChildren={t('Yes')}
										unCheckedChildren={t('No')}
									/>
								</Form.Item>
								{isPasswordVisible && (
									<>
										<Form.Item
											label={t('Password')}
											name='password'
											rules={[{ required: true, message: t('Password is required!') }]}
										>
											<Input.Password />
										</Form.Item>
										<Form.Item
											label={t('Confirm Password')}
											name='confirmPassword'
											rules={[{ required: true, message: t('Confirm password is required!') }]}
										>
											<Input.Password />
										</Form.Item>
									</>
								)}
								<Row gutter={16} align='middle'>
									<Col xs={12}>
										<Button block type='cancel' htmlType='button'>
											{t('Cancel')}
										</Button>
									</Col>
									<Col xs={12}>
										<Button block type='primary' htmlType='submit'>
											{t('Save changes')}
										</Button>
									</Col>
								</Row>
							</Form>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};

const AvatarUpload = styled(Upload)`
	.ant-avatar {
		position: relative;
		cursor: pointer;

		&::before {
			content: 'Change';
			font-size: 14px;
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			padding: 8px 0;
			text-align: center;
			line-height: 16px;
			background-color: ${({ theme }) => hexToRGB(theme.colors.primary, 0.15)};
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		&:hover::before {
			opacity: 1;
		}
	}
`;
