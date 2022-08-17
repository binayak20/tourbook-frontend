import config from '@/config';
import { Permission } from 'react-access-boundary';
import { authService } from '../auth';
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
	Territory,
	TerritoryCreateUpdatePayload,
	UserRole,
	UserRolePayload,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class SettingsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	airport(id: number) {
		return this.http.get<Airport>(`airports/${id}/`);
	}

	airports(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'airports/');
		return this.http.get<AirportsResponse>(paginateURL);
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

	categories(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'categories/');
		return this.http.get<CategoriesResponse>(paginateURL);
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

	territories(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'locations-territory/');
		return this.http.get<TerritoriesResponse>(paginateURL);
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

	locations(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'locations/');
		return this.http.get<LocationsResponse>(paginateURL);
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

	accommodations(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'accommodations/');
		return this.http.get<AccommodationsResponse>(paginateURL);
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
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const settingsAPI = new SettingsAPI(httpAuthService);
