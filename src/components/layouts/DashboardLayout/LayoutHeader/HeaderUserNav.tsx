import { usersAPI } from '@/libs/api';
import { authService } from '@/libs/auth';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu, message } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';

export const HeaderUserNav = () => {
	const { t } = useTranslation();

	const { mutate: handleLogout } = useMutation(() => usersAPI.logout(), {
		onSuccess: () => {
			authService.removeTokens();
			window.location.href = '/';
		},
		onError: (error: Error) => {
			message.error(error.message);
		},
	});

	const menuItems = [
		{
			key: 'profile',
			label: <Link to={PRIVATE_ROUTES.PROFILE}>{t('Your profile')}</Link>,
		},
		{
			key: 'change-password',
			label: <Link to={`${PRIVATE_ROUTES.PROFILE}?type=password`}>{t('Change password')}</Link>,
		},
		{
			key: 'sign-out',
			label: t('Sign out'),
		},
	];

	const handleItemClick = async (item?: MenuInfo) => {
		if (item?.key === 'sign-out') {
			handleLogout();
		}
	};

	return (
		<Dropdown
			overlay={<Menu items={menuItems} onClick={handleItemClick} />}
			trigger={['click']}
			placement='bottomRight'
		>
			<a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
				<Avatar size='large' icon={<UserOutlined />} />
			</a>
		</Dropdown>
	);
};
