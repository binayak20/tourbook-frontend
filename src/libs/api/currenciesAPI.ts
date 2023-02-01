import config from '@/config';
import { authService } from '../auth';
import {
	Currency,
	CurrencyConversation,
	CurrencyConversationCreatePayload,
	PaginateParams,
	Pagination,
} from './@types';
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

	currencyConversations({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('currency-conversions/').paginate(page,limit).getURL();
		return this.http.get<Pagination<CurrencyConversation[]>>(paginateURL);
	}

	createCurrencyConversation(payload: CurrencyConversationCreatePayload) {
		return this.http.post<CurrencyConversation>('currency-conversions/', payload);
	}

	updateCurrencyConversation(ID: number, payload: CurrencyConversationCreatePayload) {
		return this.http.put<CurrencyConversation>(`currency-conversions/${ID}/`, payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const currenciesAPI = new CurrenciesAPI(httpAuthService);
