import config from '@/config';
import { authService } from '../auth';
import { PaginateParams, Pagination, Station, StationsParams, StationType } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class StationsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: StationsParams = {}) {
		const paginateURL = this.setURL('stations/').params(params).getURL();
		return this.http.get<Pagination<Station[]>>(paginateURL);
	}

	types(params: PaginateParams = {}) {
		const paginateURL = this.setURL('station-types/').params(params).getURL();
		return this.http.get<Pagination<StationType[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const stationsAPI = new StationsAPI(httpAuthService);
