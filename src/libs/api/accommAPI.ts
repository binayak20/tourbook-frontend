import config from '@/config';
import { authService } from '../auth';
import { Accommodation, PaginateParams, Pagination } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class AccommAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: PaginateParams = {}) {
		const paginateURL = this.setURL('accommodations/').params(params).getURL();
		return this.http.get<Pagination<Accommodation[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const accommAPI = new AccommAPI(httpAuthService);
