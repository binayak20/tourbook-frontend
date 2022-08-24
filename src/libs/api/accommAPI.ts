import config from '@/config';
import { authService } from '../auth';
import { Accommodation } from './@types';
import { HttpAuthService } from './httpService';

class AccommAPI {
	constructor(private http: HttpAuthService) {}

	list() {
		return this.http.get<Accommodation[]>('accommodations/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const accommAPI = new AccommAPI(httpAuthService);
