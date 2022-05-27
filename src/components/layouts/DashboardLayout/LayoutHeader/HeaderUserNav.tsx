import { translationKeys } from '@/config/translate/i18next';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Menu } from 'antd';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const menuItems = [
	{
		key: 'profile',
		label: 'Your profile',
	},
	{
		key: 'change-password',
		label: 'Change password',
	},
	{
		key: 'sign-out',
		label: 'Sign out',
	},
];

export const HeaderUserNav: FC = () => {
	const { t } = useTranslation();

	const menuItemsWithTranslations = useMemo(() => {
		return menuItems.map((item) => ({
			...item,
			label: t(item.label as translationKeys),
		}));
	}, [t]);

	return (
		<Dropdown
			overlay={<Menu items={menuItemsWithTranslations} />}
			trigger={['click']}
			placement='bottomRight'
		>
			<a className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
				<Avatar size='large' icon={<UserOutlined />} />
			</a>
		</Dropdown>
	);
};
