import config from '@/config';
import { authService } from '../auth';
import { Currency, PaginateParams, Pagination } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class CurrenciesAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('currencies/').paginate(page, limit).getURL();
		return this.http.get<Pagination<Currency[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const currenciesAPI = new CurrenciesAPI(httpAuthService);
