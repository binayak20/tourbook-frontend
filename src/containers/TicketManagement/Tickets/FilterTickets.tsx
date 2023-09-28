import { useTranslation } from 'react-i18next';

import SearchComponent, { Field } from '../../../components/SearchComponent';
import { useTicketOptions } from './hooks/useTickeOptions';

export const FilterTickets = () => {
	const { t } = useTranslation();
	const { ticketSuppliersOptions, ticketTypesOptions } = useTicketOptions({ enableStation: false });

	const searchFields: Field[] = [
		{ type: 'input', name: 'pnr', placeholder: t('PNR') },
		{
			type: 'select',
			name: 'ticket_type',
			placeholder: t('Ticket type'),
			options: ticketTypesOptions,
		},
		{
			type: 'select',
			name: 'ticket_supplier',
			placeholder: t('Ticket Supplier'),
			options: ticketSuppliersOptions,
		},
	];
	return <SearchComponent fields={searchFields} />;
};
