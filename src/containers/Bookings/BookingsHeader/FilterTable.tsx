import SearchComponent, { Field } from '@/components/SearchComponent';
import { useTranslation } from 'react-i18next';

export const FilterTable = () => {
	const { t } = useTranslation();
	const searchFields: Field[] = [
		{
			type: 'input',
			name: 'booking_name',
			param: 'booking_name',
			defaultValue: undefined,
			placeholder: t('Passenger name'),
			tooltipTitle: t('search only with primary passenger name'),
		},
		{
			type: 'input',
			name: 'reference',
			param: 'reference',
			defaultValue: undefined,
			placeholder: t('Booking reference'),
		},
		{
			type: 'date-range',
			name: 'departure_dates',
			param: ['from_departure_date', 'to_departure_date'],
			defaultValue: undefined,
			placeholder: [t('Departure from'), t('Departure to')],
		},
		{
			type: 'date-range',
			name: 'booking_dates',
			param: ['from_booking_date', 'to_booking_date'],
			defaultValue: undefined,
			placeholder: [t('Booking from'), t('Booking to')],
		},
	];

	return <SearchComponent fields={searchFields} />;
};
