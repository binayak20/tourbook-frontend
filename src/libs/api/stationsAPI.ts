import config from '@/config';
import { authService } from '../auth';
import { Pagination, Station, StationsParams } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class StationsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list({ page = 1, name, station_type, is_active }: StationsParams = { page: 1 }) {
		const paginateURL = this.getPaginateURL(page, 'stations/');

		const params = new URLSearchParams();
		if (name) {
			params.append('name', name);
		}

		if (station_type) {
			params.append('station_type', station_type);
		}

		if (is_active !== undefined) {
			params.append('is_active', is_active.toString());
		}

		const parmasToString = params.toString();
		const url = parmasToString ? `${paginateURL}?${parmasToString}` : paginateURL;
		return this.http.get<Pagination<Station[]>>(url);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const stationsAPI = new StationsAPI(httpAuthService);
