import config from '@/config';
import { authService } from '../auth';
import { PaginateParams, Pagination, TicketSupplier } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class TicketSupplierAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: PaginateParams) {
		const paginateURL = this.setURL('ticket-suppliers/').params(params).getURL();
		return this.http.get<Pagination<TicketSupplier[]>>(paginateURL);
	}

	create(data: API.TicketSupplierCreate) {
		return this.http.post<TicketSupplier>('ticket-suppliers/', data);
	}

	update(ID: any, data: API.TicketSupplierCreate) {
		return this.http.put<TicketSupplier>(`ticket-suppliers/${ID}/`, data);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const ticketSupplierAPI = new TicketSupplierAPI(httpAuthService);
