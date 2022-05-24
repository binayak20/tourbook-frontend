import { ReactComponent as DashboardIcon } from '@/assets/images/sidebar/dashboard.svg';
import { Menu, MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem => {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem;
};

const items: MenuItem[] = [
	getItem('Dashboard', 'dashboard', <DashboardIcon />),
	getItem('User', 'user', <DashboardIcon />, [
		getItem('Tom', '3'),
		getItem('Bill', '4'),
		getItem('Alex', '5'),
	]),
	getItem('Team', 'sub2', <DashboardIcon />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
	getItem('Files', '9', <DashboardIcon />),
];

export const NavItems = () => (
	<Menu defaultSelectedKeys={['dashboard']} mode='inline' items={items} />
);
