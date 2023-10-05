/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchComponent, { FilterField } from '@/components/SearchComponent';
import { useTranslation } from 'react-i18next';

export const FilterTable = () => {
	const { t } = useTranslation();

	const searchFields: FilterField[] = [
		{
			type: 'input',
			name: 'coupon_code',
			param: 'coupon_code',
			placeholder: t('Search by code'),
		},
		{
			type: 'date-range',
			name: 'validity',
			param: ['coupon_valid_form', 'coupon_valid_to'],
			placeholder: [t('Valid from'), t('Valid to')],
		},
	];

	return <SearchComponent fields={searchFields} />;
};
