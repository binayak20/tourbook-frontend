import config from '@/config';
import { authService } from '../auth';
import { FortnoxCostCenter, Pagination } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class FortnoxAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	costCenters(page?: number, limit?: number) {
		const paginateURL = this.setURL('fortnox-cost-centers/').paginate(page, limit).getURL();
		return this.http.get<Pagination<FortnoxCostCenter[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const fortnoxAPI = new FortnoxAPI(httpAuthService);
