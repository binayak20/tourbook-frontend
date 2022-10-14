import { MenuItem } from '@/components/layouts/InnerLayout/types';
import { lazy } from 'react';

export const CURRENCIES_SETTINGS_ROUTES = {
	CURRENCY: 'all',
	CURRENCY_CONVERSION: 'currency-conversion',
};

export const currencySettingsRoutes = [
	{
		path: CURRENCIES_SETTINGS_ROUTES.CURRENCY,
		Component: lazy(() => import('./Currencies')),
	},
	{
		path: CURRENCIES_SETTINGS_ROUTES.CURRENCY_CONVERSION,
		Component: lazy(() => import('./CurrencyConversion')),
	},
];

export const MENU_ITEMS: MenuItem[] = [
	{
		name: 'All Currencies',
		path: CURRENCIES_SETTINGS_ROUTES.CURRENCY,
		permission: 'VIEW_CURRENCY',
	},
	{
		name: 'Currency Conversion',
		path: CURRENCIES_SETTINGS_ROUTES.CURRENCY_CONVERSION,
		permission: 'VIEW_CURRENCYCONVERSION',
	},
];
