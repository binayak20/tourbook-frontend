/* eslint-disable @typescript-eslint/ban-types */
import config from '@/config';
import { authService } from '../auth';
import {
	AirportCreatePayload,
	AirportsResponse,
	CategoriesResponse,
	CategoryCreatePayload,
	CategoryUpdatePayload,
	LocationCreateUpdatePayload,
	LocationsResponse,
	TerritoriesResponse,
	TerritoryCreateUpdatePayload,
} from './@types';
import { HttpAuthService } from './httpService';

class SettingsAPI {
	constructor(private http: HttpAuthService) {}

	airport(id: number) {
		return this.http.get<API.Airport>(`airports/${id}/`);
	}

	airports() {
		return this.http.get<AirportsResponse>('airports/');
	}

	airportCreate(payload: AirportCreatePayload) {
		return this.http.post<API.Airport>('airports/', payload);
	}

	airportUpdate(id: number, payload: AirportCreatePayload) {
		return this.http.put<API.Airport>(`airports/${id}/`, payload);
	}

	category(id: number) {
		return this.http.get<API.Category>(`categories/${id}/`);
	}

	categories() {
		return this.http.get<CategoriesResponse>('categories/');
	}

	parentCategories() {
		return this.http.get<API.Category[]>('categories/parent-categories/');
	}

	categoryCreate(payload: CategoryCreatePayload) {
		return this.http.post<API.Category>('categories/', payload);
	}

	categoryUpdate(id: number, payload: CategoryUpdatePayload) {
		return this.http.put<API.Category>(`categories/${id}/`, payload);
	}

	territory(id: number) {
		return this.http.get<API.Territory>(`locations-territory/${id}/`);
	}

	territories() {
		return this.http.get<TerritoriesResponse>('locations-territory/');
	}

	territoryCreate(payload: TerritoryCreateUpdatePayload) {
		return this.http.post<API.Territory>('locations-territory/', payload);
	}

	territoryUpdate(id: number, payload: TerritoryCreateUpdatePayload) {
		return this.http.put<API.Territory>(`locations-territory/${id}/`, payload);
	}

	location(id: number) {
		return this.http.get<API.Location>(`locations/${id}/`);
	}

	locations() {
		return this.http.get<LocationsResponse>('locations/');
	}

	locationCreate(payload: LocationCreateUpdatePayload) {
		return this.http.post<API.Location>('locations/', payload);
	}

	locationUpdate(id: number, payload: LocationCreateUpdatePayload) {
		return this.http.put<API.Location>(`locations/${id}/`, payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const settingsAPI = new SettingsAPI(httpAuthService);
