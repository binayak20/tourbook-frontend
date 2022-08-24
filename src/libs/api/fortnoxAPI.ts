import config from '@/config';
import { authService } from '../auth';
import { FortnoxCostCenter } from './@types';
import { HttpAuthService } from './httpService';

class FortnoxAPI {
	constructor(private http: HttpAuthService) {}

	costCenters() {
		return this.http.get<FortnoxCostCenter[]>('fortnox-cost-centers/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const fortnoxAPI = new FortnoxAPI(httpAuthService);
