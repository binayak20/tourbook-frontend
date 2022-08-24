import config from '@/config';
import { authService } from '../auth';
import { Country, CountryParams, LocationParams, LocationType, Territory } from './@types';
import { HttpAuthService } from './httpService';

class LocationsAPI {
	constructor(private http: HttpAuthService) {}

	list({ name, territory, country, is_active }: LocationParams = {}) {
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
		const url = parmasToString ? `locations/?${parmasToString}` : 'locations/';
		return this.http.get<LocationType[]>(url);
	}

	countries({ name, territory, is_active }: CountryParams = {}) {
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
		const url = parmasToString ? `countries/?${parmasToString}` : 'countries/';
		return this.http.get<Country[]>(url);
	}

	territories() {
		return this.http.get<Territory[]>('territories/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const locationsAPI = new LocationsAPI(httpAuthService);
