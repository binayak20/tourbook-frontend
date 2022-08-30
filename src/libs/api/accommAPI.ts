import config from '@/config';
import { authService } from '../auth';
import { Accommodation, Pagination } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class AccommAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(page = 1, limit = 1) {
		const paginateURL = this.getPaginateURL(page, 'accommodations/', limit);
		console.log(paginateURL);
		return this.http.get<Pagination<Accommodation[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const accommAPI = new AccommAPI(httpAuthService);
