import config from '@/config';
import { Permission } from 'react-access-boundary';
import { authService } from '../auth';
import {
	DEFAULT_LIST_PARAMS,
	EmailConfig,
	EmailConfigEvent,
	EmailConfigPayload,
	EmailConfigResponse,
	EmailEvent,
	PaginateParams,
	Pagination,
} from './@types';
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

	accommodations(page = 1, limit: number, status?: boolean) {
		const paginateURL = this.setURL('accommodations/')
			.params({ page, limit, is_active: status })
			.getURL();
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

	getEmailEvent(params: PaginateParams = {}) {
		const paginateURL = this.setURL(`email-events/`).params(params).getURL();
		return this.http.get<Pagination<EmailEvent[]>>(paginateURL);
	}

	emailConfiguration(payload: EmailConfigPayload) {
		return this.http.post<EmailConfig>('event-wise-recipients/', payload);
	}

	getEmailConfig() {
		return this.http.get<EmailConfigResponse>('event-wise-recipients/');
	}
	getSingleEmailConfig(id: number) {
		return this.http.get<EmailConfigEvent>(`event-wise-recipients/${id}/`);
	}

	emailConfigUpdate(id: number, payload: EmailConfigPayload) {
		return this.http.put<EmailConfig>(`event-wise-recipients/${id}/`, payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const settingsAPI = new SettingsAPI(httpAuthService);
