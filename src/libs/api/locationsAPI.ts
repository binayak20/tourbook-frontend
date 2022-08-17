import config from '@/config';
import { authService } from '../auth';
import { Country, LocationParams, LocationType, Pagination, Territory } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class LocationsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list({ page = 1, name, territory, is_active }: LocationParams) {
		const paginateURL = this.getPaginateURL(page, 'locations/');

		const params = new URLSearchParams();
		if (name) {
			params.append('name', name);
		}

		if (territory) {
			params.append('territory', territory.toString());
		}

		if (is_active !== undefined) {
			params.append('is_active', is_active.toString());
		}

		const parmasToString = params.toString();
		const url = parmasToString ? `${paginateURL}?${parmasToString}` : paginateURL;
		return this.http.get<Pagination<LocationType[]>>(url);
	}

	countries(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'countries/');
		return this.http.get<Pagination<Country[]>>(paginateURL);
	}

	territories(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'locations-territory/');
		return this.http.get<Pagination<Territory[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const locationsAPI = new LocationsAPI(httpAuthService);
