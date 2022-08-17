import config from '@/config';
import { Permission } from 'react-access-boundary';
import { authService } from '../auth';
import { Territory } from './@types';
import {
	Accommodation,
	AccommodationCreateUpdatePayload,
	AccommodationsResponse,
	Airport,
	AirportCreatePayload,
	AirportsResponse,
	CategoriesResponse,
	Category,
	CategoryCreatePayload,
	CategoryUpdatePayload,
	Configuration,
	CurrenciesResponse,
	CurrencyConversationCreatePayload,
	CurrencyConversationsResponse,
	LocationCreateUpdatePayload,
	LocationsResponse,
	PermissionsResponse,
	TerritoriesResponse,
	TerritoryCreateUpdatePayload,
	UserRole,
	UserRolePayload,
} from './@types/settings';
import { HttpAuthService } from './httpService';

class SettingsAPI {
	constructor(private http: HttpAuthService, private itemsPerPage = 10) {}

	airport(id: number) {
		return this.http.get<Airport>(`airports/${id}/`);
	}

	airports() {
		return this.http.get<AirportsResponse>('airports/');
	}

	airportCreate(payload: AirportCreatePayload) {
		return this.http.post<Airport>('airports/', payload);
	}

	airportUpdate(id: number, payload: AirportCreatePayload) {
		return this.http.put<Airport>(`airports/${id}/`, payload);
	}

	category(id: number) {
		return this.http.get<Category>(`categories/${id}/`);
	}

	categories() {
		return this.http.get<CategoriesResponse>('categories/');
	}

	parentCategories() {
		return this.http.get<Category[]>('categories/parent-categories/');
	}

	categoryCreate(payload: CategoryCreatePayload) {
		return this.http.post<Category>('categories/', payload);
	}

	categoryUpdate(id: number, payload: CategoryUpdatePayload) {
		return this.http.put<Category>(`categories/${id}/`, payload);
	}

	territory(id: number) {
		return this.http.get<Territory>(`locations-territory/${id}/`);
	}

	territories() {
		return this.http.get<TerritoriesResponse>('locations-territory/');
	}

	territoryCreate(payload: TerritoryCreateUpdatePayload) {
		return this.http.post<Territory>('locations-territory/', payload);
	}

	territoryUpdate(id: number, payload: TerritoryCreateUpdatePayload) {
		return this.http.put<Territory>(`locations-territory/${id}/`, payload);
	}

	location(id: number) {
		return this.http.get<Location>(`locations/${id}/`);
	}

	locations() {
		return this.http.get<LocationsResponse>('locations/');
	}

	locationCreate(payload: LocationCreateUpdatePayload) {
		return this.http.post<Location>('locations/', payload);
	}

	locationUpdate(id: number, payload: LocationCreateUpdatePayload) {
		return this.http.put<Location>(`locations/${id}/`, payload);
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
		return this.http.get<AccommodationsResponse>('accommodations/');
	}

	accommodation(id: number) {
		return this.http.get<Accommodation>(`accommodations/${id}/`);
	}

	accommodationCreate(payload: AccommodationCreateUpdatePayload) {
		return this.http.post<Accommodation>('accommodations/', payload);
	}

	accommodationUpdate(id: number, payload: AccommodationCreateUpdatePayload) {
		return this.http.put<Accommodation>(`accommodations/${id}/`, payload);
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

	currencies() {
		return this.http.get<CurrenciesResponse>('currencies/');
	}

	currencyConversations(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'currency-conversions/');
		return this.http.get<CurrencyConversationsResponse>(paginateURL);
	}

	createCurrencyConversation(payload: CurrencyConversationCreatePayload) {
		return this.http.post<CurrencyConversationsResponse>('currency-conversions/', payload);
	}

	updateCurrencyConversation(ID: number, payload: CurrencyConversationCreatePayload) {
		return this.http.put<CurrencyConversationsResponse>(`currency-conversions/${ID}/`, payload);
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
