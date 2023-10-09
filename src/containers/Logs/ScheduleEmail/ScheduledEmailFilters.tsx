import SearchComponent, { FilterField } from '@/components/SearchComponent';
import { useTranslation } from 'react-i18next';

function ScheduledEmailFilters() {
	const { t } = useTranslation();
	const searchFields: FilterField[] = [
		{
			type: 'input',
			name: 'to_email',
			param: 'to_email',
			placeholder: t('Search by email'),
		},
		{
			type: 'input',
			name: 'event',
			param: 'event',
			placeholder: t('Search by event'),
		},
	];
	return <SearchComponent fields={searchFields} />;
}

export default ScheduledEmailFilters;
