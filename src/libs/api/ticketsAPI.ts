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
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const ticketsAPI = new TicketsAPI(httpAuthService);
