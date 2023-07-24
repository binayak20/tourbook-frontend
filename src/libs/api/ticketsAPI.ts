import config from '@/config';
import { authService } from '../auth';
import { PaginateParams, Pagination, Ticket } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class TicketsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: PaginateParams) {
		const paginateURL = this.setURL('tickets/').params(params).getURL();
		return this.http.get<Pagination<Ticket[]>>(paginateURL);
	}
	create(data: API.TicketCreate) {
		return this.http.post<{ details: string }>('tickets/', data);
	}

	update(ID: any, data: API.TicketCreate) {
		return this.http.put<{ details: string }>(`tickets/${ID}/`, data);
	}

	delete(ID: any) {
		return this.http.patch<{ details: string }>(`tickets/${ID}/soft-delete/`, {});
	}

	reminder(ID: any, data: API.CreateReminder) {
		return this.http.put<{ details: string }>(`tickets/${ID}/reminder-email/`, data);
	}
}
const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const ticketsAPI = new TicketsAPI(httpAuthService);