import { translationKeys } from '@/config/translate/i18next';
import { CURRENCIES_SETTINGS_ROUTES } from '@/pages/SettingsCurrencies/contstants';

export type MenuItem = {
	name: translationKeys;
	path: string;
	childrens?: MenuItem[];
	permission?: string | string[];
};

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'All Currencies',
		path: CURRENCIES_SETTINGS_ROUTES.CUURENCIES,
	},
	{
		name: 'Currency Conversion',
		path: CURRENCIES_SETTINGS_ROUTES.CURRENCY_CONVERSION,
	},
];
