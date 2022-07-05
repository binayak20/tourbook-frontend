/* eslint-disable @typescript-eslint/ban-types */
import config from '@/config';
import { authService } from '../auth';
import {
	AirporCreateUpdateResponse,
	AirportCreatePayload,
	AirportsResponse,
	CategoriesResponse,
	CategoryCreatePayload,
	CategoryCreateUpdateResponse,
	CategoryUpdatePayload,
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
		return this.http.post<AirporCreateUpdateResponse>('airports/', payload);
	}

	airportUpdate(id: number, payload: AirportCreatePayload) {
		return this.http.put<AirporCreateUpdateResponse>(`airports/${id}/`, payload);
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
		return this.http.post<CategoryCreateUpdateResponse>('categories/', payload);
	}

	categoryUpdate(payload: CategoryUpdatePayload) {
		return this.http.put<CategoryCreateUpdateResponse>('categories/', payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const settingsAPI = new SettingsAPI(httpAuthService);
