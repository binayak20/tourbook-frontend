/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchComponent, { FilterField } from '@/components/SearchComponent';
import { useTranslation } from 'react-i18next';

export const UserFilters = () => {
	const { t } = useTranslation();

	const searchFields: FilterField[] = [
		{
			type: 'input',
			name: 'email',
			param: 'email',
			placeholder: t('Search by email'),
		},
		{
			type: 'input',
			name: 'name',
			param: 'name',
			placeholder: t('Search by name'),
		},
		{
			type: 'switch',
			name: 'is_passenger',
			param: 'is_passenger',
			value: true,
			placeholder: t('Passenger'),
		},
	];

	return <SearchComponent fields={searchFields} />;
};
