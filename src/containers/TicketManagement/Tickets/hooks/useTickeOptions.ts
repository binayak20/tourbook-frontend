import { stationsAPI } from '@/libs/api';
import { ticketSupplierAPI } from '@/libs/api/ticketSupplierAPI';
import { ticketTypeAPI } from '@/libs/api/ticketTypeAPI';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { useQueries } from 'react-query';

export const useTicketOptions = () => {
	const [
		{ isLoading: fetchingStations, data: stations },
		{ isLoading: fetchingTicketTypes, data: ticketTypes },
		{ isLoading: fetchingTicketSuppliers, data: ticketSuppliers },
	] = useQueries([
		{ queryKey: ['stations'], queryFn: () => stationsAPI.list(DEFAULT_LIST_PARAMS) },
		{ queryKey: ['ticket-types'], queryFn: () => ticketTypeAPI.list(DEFAULT_LIST_PARAMS) },
		{ queryKey: ['ticket-suppliers'], queryFn: () => ticketSupplierAPI.list(DEFAULT_LIST_PARAMS) },
	]);
	const stationsOptions = stations?.results?.map((station) => ({
		label: station.name,
		value: station.id,
	}));
	const ticketTypesOptions = ticketTypes?.results?.map((ticketType) => ({
		label: ticketType.name,
		value: ticketType.id,
	}));
	const ticketSuppliersOptions = ticketSuppliers?.results?.map((ticketSupplier) => ({
		label: ticketSupplier.name,
		value: ticketSupplier.id,
	}));
	return {
		stationsOptions,
		ticketTypesOptions,
		ticketSuppliersOptions,
		fetchingStations,
		fetchingTicketTypes,
		fetchingTicketSuppliers,
	};
};
