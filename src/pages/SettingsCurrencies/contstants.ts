import { lazy } from 'react';

export const CURRENCIES_SETTINGS_ROUTES = {
	CUURENCIES: 'all',
	CURRENCY_CONVERSION: 'currency-conversion',
};

export const currencySettingsRoutes = [
	{
		path: CURRENCIES_SETTINGS_ROUTES.CUURENCIES,
		Component: lazy(() => import('./Currencies')),
	},
	{
		path: CURRENCIES_SETTINGS_ROUTES.CURRENCY_CONVERSION,
		Component: lazy(() => import('./CurrencyConversion')),
	},
];
