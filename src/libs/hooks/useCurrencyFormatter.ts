import { useStoreSelector } from '@/store';
import { useCallback, useMemo } from 'react';

const DEFAULT_LOCALE = 'sv-SE';
const DEFAULT_CODE = 'SEK';

export const useFormatCurrency = (currencyCode?: string, locale?: string) => {
	const { language } = useStoreSelector((state) => state.app);
	const code = currencyCode || DEFAULT_CODE;
	const currencyLocale = locale || language || DEFAULT_LOCALE;
	const formatter = useMemo(() => {
		try {
			return new Intl.NumberFormat(currencyLocale, {
				style: 'currency',
				currency: code,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			});
		} catch (error) {
			console.error(error);
		}
		return null;
	}, [code, currencyLocale]);

	const formatterFraction = useMemo(() => {
		try {
			return new Intl.NumberFormat(currencyLocale, {
				style: 'currency',
				currency: code,
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		} catch (error) {
			console.error(error);
		}
		return null;
	}, [code, currencyLocale]);

	const formatCurrency = useCallback(
		(amount?: number) => formatter?.format(amount || 0) || NaN,
		[formatter]
	);

	const formatCurrencyWithFraction = useCallback(
		(amount?: number) => formatterFraction?.format(amount || 0) || NaN,
		[formatterFraction]
	);
	return { formatCurrency, formatCurrencyWithFraction };
};
