/* eslint-disable @typescript-eslint/no-explicit-any */
import SearchComponent, { FilterField } from '@/components/SearchComponent';
import { locationsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

export const FilterTable = () => {
	const { t } = useTranslation();

	const [{ data: locations, isLoading }] = useQueries([
		{
			queryKey: ['locations'],
			queryFn: () => locationsAPI.list(DEFAULT_LIST_PARAMS),
		},
	]);

	const locationsOptions = useMemo(() => {
		return (locations?.results || []).map(({ id, name }) => {
			return { value: id, label: name };
		});
	}, [locations]);

	const searchFields: FilterField[] = [
		{
			type: 'input',
			name: 'name',
			param: 'name',
			placeholder: t('Search by name'),
		},
		{
			type: 'select',
			name: 'location',
			param: 'location',
			placeholder: t('Locations'),
			options: locationsOptions,
			isLoading: isLoading,
		},
		{
			type: 'date-range',
			name: 'departure_dates',
			param: ['from_departure_date', 'to_departure_date'],
			placeholder: [t('Departure from'), t('Departure to')],
		},
		{
			type: 'switch',
			name: 'remaining_capacity',
			param: 'remaining_capacity',
			value: '1',
			placeholder: t('Filter by capacity'),
		},
	];

	return <SearchComponent fields={searchFields} />;
};
