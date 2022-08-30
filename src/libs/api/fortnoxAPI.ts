import config from '@/config';
import { authService } from '../auth';
import { FortnoxCostCenter, Pagination } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class FortnoxAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	costCenters(page = 1, limit?: number) {
		const paginateURL = this.getPaginateURL(page, 'fortnox-cost-centers/', limit);
		return this.http.get<Pagination<FortnoxCostCenter[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const fortnoxAPI = new FortnoxAPI(httpAuthService);
