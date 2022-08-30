import config from '@/config';
import { authService } from '../auth';
import {
	Country,
	CountryParams,
	LocationCreatePayload,
	LocationParams,
	LocationType,
	Pagination,
	Territory,
	TerritoryParams,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class LocationsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list({ name, territory, country, is_active, limit, page = 1 }: LocationParams = {}) {
		const paginateURL = this.getPaginateURL(page, 'locations/', limit);
		const searchParams = new URLSearchParams();

		if (name) {
			searchParams.append('name', name);
		}

		if (territory) {
			searchParams.append('territory', territory.toString());
		}

		if (country) {
			searchParams.append('country', country.toString());
		}

		if (is_active !== undefined) {
			searchParams.append('is_active', is_active.toString());
		}

		const parmasToString = searchParams.toString();
		const url = parmasToString ? `${paginateURL}/&${parmasToString}` : paginateURL;
		return this.http.get<Pagination<LocationType[]>>(url);
	}

	getOne(id: number) {
		return this.http.get<LocationType>(`locations/${id}/`);
	}

	create(payload: LocationCreatePayload) {
		return this.http.post<Location>('locations/', payload);
	}

	update(id: number, payload: LocationCreatePayload) {
		return this.http.put<Location>(`locations/${id}/`, payload);
	}

	countries({ name, territory, is_active, page = 1, limit }: CountryParams = {}) {
		const paginateURL = this.getPaginateURL(page, 'territories/', limit);

		const searchParams = new URLSearchParams();
		if (name) {
			searchParams.append('name', name);
		}

		if (territory) {
			searchParams.append('territory', territory.toString());
		}

		if (is_active !== undefined) {
			searchParams.append('is_active', is_active.toString());
		}

		const parmasToString = searchParams.toString();
		const url = parmasToString ? `${paginateURL}&${parmasToString}` : paginateURL;
		return this.http.get<Pagination<Country[]>>(url);
	}

	territories({ page = 1, limit }: TerritoryParams) {
		const paginateURL = this.getPaginateURL(page, 'territories/', limit);
		return this.http.get<Pagination<Territory[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const locationsAPI = new LocationsAPI(httpAuthService);
