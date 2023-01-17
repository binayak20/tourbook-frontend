import config from '@/config';
import { authService } from '../auth';
import { Pagination, Transactions, TransactionsParams } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class TransactionsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(parmas: TransactionsParams = {}) {
		const paginateURL = this.setURL('transactions/').params(parmas).getURL();
		return this.http.get<Pagination<Transactions[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const transactionsAPI = new TransactionsAPI(httpAuthService);
