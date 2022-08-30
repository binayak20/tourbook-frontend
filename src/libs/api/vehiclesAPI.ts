import config from '@/config';
import { authService } from '../auth';
import { PaginateParams, Pagination, Vehicle } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class VehiclesAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('vehicles/').paginate(page, limit).getURL();
		return this.http.get<Pagination<Vehicle[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const vehiclesAPI = new VehiclesAPI(httpAuthService);
