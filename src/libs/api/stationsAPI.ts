import config from '@/config';
import { authService } from '../auth';
import { Pagination, Station, StationsParams, StationTypeItem } from './@types';
import { HttpAuthService } from './httpService';

class StationsAPI {
	constructor(private http: HttpAuthService) {}

	list({ name, station_type, is_active }: StationsParams = {}) {
		const params = new URLSearchParams();
		if (name) {
			params.append('name', name);
		}

		if (station_type) {
			params.append('station_type', station_type.toString());
		}

		if (is_active !== undefined) {
			params.append('is_active', is_active.toString());
		}

		const parmasToString = params.toString();
		const url = parmasToString ? `stations/?${parmasToString}` : 'stations/';
		return this.http.get<Station[]>(url);
	}

	types() {
		return this.http.get<Pagination<StationTypeItem[]>>('station-types/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const stationsAPI = new StationsAPI(httpAuthService);
