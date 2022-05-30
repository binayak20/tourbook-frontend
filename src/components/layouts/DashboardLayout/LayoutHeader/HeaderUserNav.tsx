import { routeNavigate } from '@/routes/utils';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const HeaderUserNav: FC = () => {
	const { t } = useTranslation();

	const menuItems = [
		{
			key: 'profile',
			label: (
				<Link to={routeNavigate('SETTINGS_PROFILE')}>
					<a>{t('Your profile')}</a>
				</Link>
			),
		},
		{
			key: 'change-password',
			label: (
				<Link to={`${routeNavigate('SETTINGS_PROFILE')}?type=password`}>
					<a>{t('Change password')}</a>
				</Link>
			),
		},
		{
			key: 'sign-out',
			label: t('Sign out'),
		},
	];

	return (
		<Dropdown
			overlay={<Menu items={menuItems} onClick={(info) => console.log(info)} />}
			trigger={['click']}
			placement='bottomRight'
		>
			<a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
				<Avatar size='large' icon={<UserOutlined />} />
			</a>
		</Dropdown>
	);
};
