import config from '@/config';
import { authService } from '../auth';
import { AccountingConfig, PaginateParams, Pagination } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class AccountingAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: PaginateParams = {}) {
		const paginateURL = this.setURL('accounting-provider-configurations/').params(params).getURL();
		return this.http.get<Pagination<AccountingConfig[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const accountingAPI = new AccountingAPI(httpAuthService);
