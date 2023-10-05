/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchComponent, { FilterField } from '@/components/SearchComponent';
import { useTranslation } from 'react-i18next';

export const FilterTable = () => {
	const { t } = useTranslation();

	const searchFields: FilterField[] = [
		{
			type: 'input',
			name: 'name',
			param: 'name',
			placeholder: t('Search by name'),
		},
	];

	return <SearchComponent fields={searchFields} />;
};
