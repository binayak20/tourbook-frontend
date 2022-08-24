import config from '@/config';
import { authService } from '../auth';
import {
	Supplement,
	SupplementCategory,
	SupplementCategoryCreatePayload,
	SupplementCreatePayload,
	SupplementParmas,
	SupplementUpdatePayload,
} from './@types';
import { HttpAuthService } from './httpService';

class SupplementsAPI {
	constructor(private http: HttpAuthService) {}

	list({ name, supplement_category, is_active }: SupplementParmas = {}) {
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
		const url = parmasToString ? `supplements/?${parmasToString}` : 'supplements/';
		return this.http.get<Supplement[]>(url);
	}

	create(payload: SupplementCreatePayload) {
		return this.http.post<Supplement>('supplements/', payload);
	}

	update(ID: number, payload: SupplementUpdatePayload) {
		return this.http.put<Supplement>(`supplements/${ID}/`, payload);
	}

	categories() {
		return this.http.get<SupplementCategory[]>('supplement-categories/');
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

	subCategories(categoryID: number) {
		return this.http.get<SupplementCategory[]>(
			`supplement-categories/${categoryID}/sub-categories/`
		);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const supplementsAPI = new SupplementsAPI(httpAuthService);
