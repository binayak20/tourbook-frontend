import SearchComponent, { FilterField } from '@/components/SearchComponent';
import { useTranslation } from 'react-i18next';

export const BookingFilters = () => {
	const { t } = useTranslation();
	const searchFields: FilterField[] = [
		{
			type: 'input',
			name: 'booking_name',
			param: 'booking_name',
			placeholder: t('Passenger name'),
			tooltipTitle: t('search only with primary passenger name'),
		},
		{
			type: 'input',
			name: 'reference',
			param: 'reference',
			placeholder: t('Booking reference'),
		},
		{
			type: 'date-range',
			name: 'departure_dates',
			param: ['from_departure_date', 'to_departure_date'],
			placeholder: [t('Departure from'), t('Departure to')],
		},
		{
			type: 'date-range',
			name: 'booking_dates',
			param: ['from_booking_date', 'to_booking_date'],
			placeholder: [t('Booking from'), t('Booking to')],
		},
	];

	return <SearchComponent fields={searchFields} />;
};
