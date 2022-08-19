import config from '@/config';
import { authService } from '../auth';
import { Country, LocationParams, LocationType, Territory } from './@types';
import { HttpAuthService } from './httpService';

class LocationsAPI {
	constructor(private http: HttpAuthService) {}

	list({ name, territory, is_active }: LocationParams = {}) {
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
		const url = parmasToString ? `locations/?${parmasToString}` : 'locations/';
		return this.http.get<LocationType[]>(url);
	}

	countries() {
		return this.http.get<Country[]>('countries/');
	}

	territories() {
		return this.http.get<Territory[]>('locations-territory/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const locationsAPI = new LocationsAPI(httpAuthService);
