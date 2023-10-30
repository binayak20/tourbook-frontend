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
	return { formatCurrency };
};
