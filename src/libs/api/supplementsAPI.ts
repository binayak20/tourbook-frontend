import config from '@/config';
import { authService } from '../auth';
import {
	PaginateParams,
	Pagination,
	Supplement,
	SupplementCategoriesParams,
	SupplementCategory,
	SupplementCategoryCreatePayload,
	SupplementCreatePayload,
	SupplementParams,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class SupplementsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: SupplementParams = {}) {
		const paginateURL = this.setURL('supplements/').params(params).getURL();
		return this.http.get<Pagination<Supplement[]>>(paginateURL);
	}

	create(payload: SupplementCreatePayload) {
		return this.http.post<Supplement>('supplements/', payload);
	}

	update(ID: number, payload: SupplementCreatePayload) {
		return this.http.put<Supplement>(`supplements/${ID}/`, payload);
	}

	categories(params: SupplementCategoriesParams = {}) {
		const paginateURL = this.setURL('supplement-categories/').params(params).getURL();
		return this.http.get<Pagination<SupplementCategory[]>>(paginateURL);
	}

	category(ID: number) {
		return this.http.get<SupplementCategory>(`supplement-categories/${ID}/`);
	}

	createCategory(payload: SupplementCategoryCreatePayload) {
		return this.http.post<SupplementCategory>('supplement-categories/', payload);
	}

	updateCategory(ID: number, payload: SupplementCategoryCreatePayload) {
		return this.http.put<SupplementCategory>(`supplement-categories/${ID}/`, payload);
	}

	updateCategoryStatus(ID: number, is_active: boolean) {
		return this.http.patch<SupplementCategory>(`supplement-categories/${ID}/update-status/`, {
			is_active,
		});
	}

	subCategories(categoryID: number, { page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL(`supplement-categories/${categoryID}/sub-categories/`)
			.paginate(page, limit)
			.getURL();
		return this.http.get<Pagination<SupplementCategory[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const supplementsAPI = new SupplementsAPI(httpAuthService);
