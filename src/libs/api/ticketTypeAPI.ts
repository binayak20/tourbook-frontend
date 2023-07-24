import config from '@/config';
import { authService } from '../auth';
import { PaginateParams, Pagination, TicketType } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class TicketTypeAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: PaginateParams) {
		const paginateURL = this.setURL('ticket-types/').params(params).getURL();
		return this.http.get<Pagination<TicketType[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const ticketTypeAPI = new TicketTypeAPI(httpAuthService);
