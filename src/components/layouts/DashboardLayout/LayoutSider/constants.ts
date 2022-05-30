import { ReactComponent as DashboardIcon } from '@/assets/images/sidebar/dashboard.svg';
import { ReactComponent as SettingsIcon } from '@/assets/images/sidebar/settings.svg';
import { ReactComponent as UserIcon } from '@/assets/images/sidebar/user.svg';
import { translationKeys } from '@/config/translate/i18next';
import { routeNavigate } from '@/routes/utils';

export type MenuItem = {
	name: translationKeys;
	path: string;
	ItemIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
	childrens?: MenuItem[];
};

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'Dashboard',
		ItemIcon: DashboardIcon,
		path: routeNavigate('DASHBOARD'),
	},
	{
		name: 'Users',
		ItemIcon: UserIcon,
		path: routeNavigate('USERS'),
		childrens: [
			{
				name: 'All users',
				path: routeNavigate('USERS'),
			},
			{
				name: 'Create user',
				path: routeNavigate('USERS_CREATE'),
			},
			{
				name: 'Roles',
				path: routeNavigate('USERS_ROLES'),
			},
		],
	},
	{
		name: 'Settings',
		ItemIcon: SettingsIcon,
		path: routeNavigate('SETTINGS'),
		childrens: [
			{
				name: 'Profile',
				path: routeNavigate('SETTINGS_PROFILE'),
			},
		],
	},
];
