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

	updateStatus(ID: number, is_active: boolean) {
		return this.http.put(`accounting-provider-configurations/${ID}/update-status/`, { is_active });
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const accountingAPI = new AccountingAPI(httpAuthService);
