import config from '@/config';
import { authService } from '../auth';
import { Accommodation, Pagination } from './@types';
import { HttpAuthService } from './httpService';

class AccommAPI {
	constructor(private http: HttpAuthService) {}

	list() {
		return this.http.get<Pagination<Accommodation[]>>('accommodations/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const accommAPI = new AccommAPI(httpAuthService);
