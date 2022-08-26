import { translationKeys } from '@/config/translate/i18next';
import { LOCATIONS_SETTINGS_ROUTES } from '@/pages/SettingsLocations/contstants';

export type MenuItem = {
	name: translationKeys;
	path: string;
	childrens?: MenuItem[];
	permission?: string | string[];
};

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'All Locations',
		path: LOCATIONS_SETTINGS_ROUTES.LOCATIONS,
	},
	{
		name: 'Countries',
		path: LOCATIONS_SETTINGS_ROUTES.COUNTRIES,
	},
	{
		name: 'Territories',
		path: LOCATIONS_SETTINGS_ROUTES.TERRITORRIES,
	},
];
