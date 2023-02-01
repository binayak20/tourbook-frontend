import config from '@/config';
import { Permission } from 'react-access-boundary';
import { authService } from '../auth';
import { DEFAULT_LIST_PARAMS } from './@types';
import {
	Accommodation,
	AccommodationCreateUpdatePayload,
	AccommodationsResponse,
	CategoriesResponse,
	Category,
	CategoryCreatePayload,
	CategoryUpdatePayload,
	Configuration,
	PermissionsResponse,
	UserRole,
	UserRolePayload,
} from './@types/settings';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class SettingsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	category(id: number) {
		return this.http.get<Category>(`categories/${id}/`);
	}

	categories(params: DEFAULT_LIST_PARAMS = {}) {
		const paginateURL = this.setURL('categories/').params(params).getURL();
		return this.http.get<CategoriesResponse>(paginateURL);
	}

	parentCategories(params: DEFAULT_LIST_PARAMS = {}) {
		const paginateURL = this.setURL('categories/parent-categories/').params(params).getURL();
		return this.http.get<Category[]>(paginateURL);
	}

	categoryCreate(payload: CategoryCreatePayload) {
		return this.http.post<Category>('categories/', payload);
	}

	categoryUpdate(id: number, payload: CategoryUpdatePayload) {
		return this.http.put<Category>(`categories/${id}/`, payload);
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
		const paginateURL = this.setURL('accommodations/').paginate(page).getURL();
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
		const paginateURL = this.setURL('auth-groups/').paginate(page).getURL();
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
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const settingsAPI = new SettingsAPI(httpAuthService);
