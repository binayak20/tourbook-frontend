import config from '@/config';
import { authService } from '../auth';
import {
	Country,
	CountryParams,
	DEFAULT_LIST_PARAMS,
	LocationCreatePayload,
	LocationParams,
	LocationType,
	Pagination,
	Territory,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class LocationsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: LocationParams = {}) {
		const paginateURL = this.setURL('locations/').params(params).getURL();
		return this.http.get<Pagination<LocationType[]>>(paginateURL);
	}

	getOne(ID: number) {
		return this.http.get<LocationType>(`locations/${ID}/`);
	}

	create(payload: LocationCreatePayload) {
		return this.http.post<Location>('locations/', payload);
	}

	update(ID: number, payload: LocationCreatePayload) {
		return this.http.put<Location>(`locations/${ID}/`, payload);
	}

	countries(params: CountryParams = {}) {
		const paginateURL = this.setURL('countries/').params(params).getURL();
		return this.http.get<Pagination<Country[]>>(paginateURL);
	}

	territories(params: DEFAULT_LIST_PARAMS = {}) {
		const paginateURL = this.setURL('territories/').params(params).getURL();
		return this.http.get<Pagination<Territory[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const locationsAPI = new LocationsAPI(httpAuthService);