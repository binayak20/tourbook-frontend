import config from '@/config';
import { authService } from '../auth';
import { Currency, Pagination } from './@types';
import { HttpAuthService } from './httpService';

class CurrenciesAPI {
	constructor(private http: HttpAuthService) {}

	list() {
		return this.http.get<Pagination<Currency[]>>('currencies/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const currenciesAPI = new CurrenciesAPI(httpAuthService);
