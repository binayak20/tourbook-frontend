import config from '@/config';
import { Permission } from 'react-access-boundary';
import { authService } from '../auth';
import {
	AccomodationsResponse,
	AirportCreatePayload,
	AirportsResponse,
	CategoriesResponse,
	CategoryCreatePayload,
	CategoryUpdatePayload,
	Configuration,
	LocationCreateUpdatePayload,
	LocationsResponse,
	PermissionsResponse,
	TerritoriesResponse,
	TerritoryCreateUpdatePayload,
	UserRole,
	UserRolePayload,
} from './@types';
import { HttpAuthService } from './httpService';

class SettingsAPI {
	constructor(private http: HttpAuthService, private itemsPerPage = 10) {}

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

	configurations() {
		return this.http.get<Configuration>('configuration/');
	}

	updateConfigurations(payload: Configuration) {
		return this.http.put<Configuration>('configuration/', payload);
	}

	uploadFile(payload: FormData) {
		return this.http.upload<Configuration>('configuration/file-upload/', payload);
	}

	accommodations() {
		return this.http.get<AccomodationsResponse>('accommodations/');
	}

	accomodation(id: number) {
		return this.http.get<API.Accomodation>(`accommodations/${id}/`);
	}

	accomodationCreate(payload: API.AccomodationCreateUpdatePayload) {
		return this.http.post<API.Accomodation>('accommodations/', payload);
	}

	accomodationUpdate(id: number, payload: API.AccomodationCreateUpdatePayload) {
		return this.http.put<API.Accomodation>(`accommodations/${id}/`, payload);
	}

	permissions() {
		return this.http.get<Permission>('auth-permissions/');
	}

	contentPermissions() {
		return this.http.get<PermissionsResponse[]>('content-type-permissions/');
	}
	userRoles(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'auth-groups/');
		return this.http.get<UserRole[]>(paginateURL);
	}

	userRole(ID: number) {
		return this.http.get<UserRole>(`auth-groups/${ID}/`);
	}

	updateUserRole(ID: number, payload: UserRolePayload) {
		return this.http.put<UserRole>(`auth-groups/${ID}/`, payload);
	}

	createUserRole(payload: UserRolePayload) {
		return this.http.post<UserRole>('auth-groups/', payload);
	}

	private getPaginateURL(page: number, url: string) {
		const offset = (page - 1) * this.itemsPerPage;
		const params = new URLSearchParams();
		if (offset > 0) {
			params.append('offset', offset.toString());
			params.append('limit', this.itemsPerPage.toString());
			return `${url}?${params.toString()}`;
		}

		return url;
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const settingsAPI = new SettingsAPI(httpAuthService);
