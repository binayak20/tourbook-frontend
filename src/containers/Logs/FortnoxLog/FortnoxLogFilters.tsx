import SearchComponent, { FilterField } from '@/components/SearchComponent';
import { fortnoxAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries } from 'react-query';

export const FortnoxLogFilters = () => {
	const { t } = useTranslation();

	const [{ data: fortnoxEvents, isLoading }] = useQueries([
		{
			queryKey: ['fortnox-events'],
			queryFn: () => fortnoxAPI.events(DEFAULT_LIST_PARAMS),
		},
	]);

	const paymentMethodOptions = useMemo(() => {
		return (fortnoxEvents?.results || []).map((event) => {
			return { value: event.name, label: event.name };
		});
	}, [fortnoxEvents]);

	const searchFields: FilterField[] = [
		{
			type: 'input',
			name: 'booking_reference',
			param: 'booking_reference',
			placeholder: t('Search by booking ref'),
		},
		{
			type: 'input',
			name: 'voucher_number',
			param: 'voucher_number',
			placeholder: t('Search by voucher number'),
		},
		{
			type: 'select',
			name: 'fortnox_event',
			param: 'fortnox_event',
			placeholder: t('Select fortnox event'),
			isLoading: isLoading,
			options: paymentMethodOptions,
		},
	];

	return <SearchComponent fields={searchFields} />;
};
