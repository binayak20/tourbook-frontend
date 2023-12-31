import config from '@/config';
import { authService } from '../auth';
import { AssignedPassenger, PaginateParams, Pagination, Ticket, TicketSearchParam } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class TicketsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: PaginateParams & TicketSearchParam) {
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

	upload(data: FormData) {
		return this.http.upload<{ file_name: string; excel_file: string }>('ticket-upload/', data);
	}
	assignedPassenger(id: number | string | undefined, params: PaginateParams) {
		const paginateURL = this.setURL(`tickets/${id}/assigned-passengers/`).params(params).getURL();
		return this.http.get<Pagination<AssignedPassenger[]>>(paginateURL);
	}

	assignedPassengerDownload(id: number | string | undefined) {
		return this.http.post<Blob>(`tickets/${id}/download-assigned-passengers-info/`, {});
	}
}
const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const ticketsAPI = new TicketsAPI(httpAuthService);
