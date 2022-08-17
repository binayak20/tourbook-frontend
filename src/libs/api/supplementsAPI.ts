import config from '@/config';
import { authService } from '../auth';
import {
	Pagination,
	Supplement,
	SupplementCategory,
	SupplementCategoryCreatePayload,
	SupplementParmas,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class SupplementsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list({ page = 1, name, supplement_category, is_active }: SupplementParmas = { page: 1 }) {
		const paginateURL = this.getPaginateURL(page, 'supplements/');

		const params = new URLSearchParams();
		if (name) {
			params.append('name', name);
		}

		if (supplement_category) {
			params.append('supplement_category', supplement_category.toString());
		}

		if (is_active !== undefined) {
			params.append('is_active', is_active.toString());
		}

		const parmasToString = params.toString();
		const url = parmasToString ? `${paginateURL}?${parmasToString}` : paginateURL;
		return this.http.get<Pagination<Supplement[]>>(url);
	}

	categories(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'supplement-categories/');
		return this.http.get<Pagination<SupplementCategory[]>>(paginateURL);
	}

	category(ID: number) {
		return this.http.get<SupplementCategory>(`supplement-categories/${ID}/`);
	}

	createCategory(payload: SupplementCategoryCreatePayload) {
		return this.http.post<SupplementCategory>('supplement-categories/', payload);
	}

	subCategories(categoryID: number) {
		return this.http.get<SupplementCategory[]>(
			`supplement-categories/${categoryID}/sub-categories/`
		);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const supplementsAPI = new SupplementsAPI(httpAuthService);
