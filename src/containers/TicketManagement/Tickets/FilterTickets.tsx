import { useTranslation } from 'react-i18next';

import SearchComponent, { FilterField } from '@/components/SearchComponent';
import { useTicketOptions } from './hooks/useTickeOptions';

export const FilterTickets = () => {
	const { t } = useTranslation();
	const { ticketSuppliersOptions, ticketTypesOptions } = useTicketOptions({ enableStation: false });

	const searchFields: FilterField[] = [
		{ type: 'input', name: 'pnr', param: 'pnr', placeholder: t('PNR') },
		{
			type: 'select',
			name: 'ticket_type',
			param: 'ticket_type',

			placeholder: t('Ticket type'),
			options: ticketTypesOptions || [],
		},
		{
			type: 'select',
			name: 'ticket_supplier',
			param: 'ticket_supplier',

			placeholder: t('Ticket Supplier'),
			options: ticketSuppliersOptions || [],
		},
	];

	return <SearchComponent fields={searchFields} />;
};
