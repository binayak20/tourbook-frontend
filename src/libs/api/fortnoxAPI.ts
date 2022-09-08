import config from '@/config';
import { authService } from '../auth';
import { FortnoxCostCenter, PaginateParams, Pagination } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class FortnoxAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	costCenters({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('fortnox-cost-centers/').paginate(page, limit).getURL();
		return this.http.get<Pagination<FortnoxCostCenter[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const fortnoxAPI = new FortnoxAPI(httpAuthService);
