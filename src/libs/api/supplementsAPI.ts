import config from '@/config';
import { authService } from '../auth';
import {
	Supplement,
	SupplementCategory,
	SupplementCategoryCreatePayload,
	SupplementParmas,
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

	categories() {
		return this.http.get<SupplementCategory[]>('supplement-categories/');
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
