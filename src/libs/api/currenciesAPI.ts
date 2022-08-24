import config from '@/config';
import { authService } from '../auth';
import { Currency } from './@types';
import { HttpAuthService } from './httpService';

class CurrenciesAPI {
	constructor(private http: HttpAuthService) {}

	list() {
		return this.http.get<Currency[]>('currencies/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const currenciesAPI = new CurrenciesAPI(httpAuthService);
