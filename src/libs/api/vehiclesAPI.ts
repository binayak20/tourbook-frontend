import config from '@/config';
import { authService } from '../auth';
import { Pagination, Vehicle } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class VehiclesAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(page = 1, limit = config.itemsPerPage) {
		const paginateURL = this.getPaginateURL(page, 'vehicles/', limit);
		return this.http.get<Pagination<Vehicle[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const vehiclesAPI = new VehiclesAPI(httpAuthService);
