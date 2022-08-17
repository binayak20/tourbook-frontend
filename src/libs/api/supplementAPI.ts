import config from '@/config';
import { authService } from '../auth';
import {
	Pagination,
	Supplement,
	SupplementCategory,
	SupplementCategoryCreatePayload,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class SupplementAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	supplements(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'supplements/');
		return this.http.get<Pagination<Supplement[]>>(paginateURL);
	}

	supplementCategories(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'supplement-categories/');
		return this.http.get<Pagination<SupplementCategory[]>>(paginateURL);
	}

	supplementCategory(ID: number) {
		return this.http.get<SupplementCategory>(`supplement-categories/${ID}/`);
	}

	createSupplementCategory(payload: SupplementCategoryCreatePayload) {
		return this.http.post<SupplementCategory>('supplement-categories/', payload);
	}

	supplementSubCategories(ID: number) {
		return this.http.get<SupplementCategory[]>(`supplement-categories/${ID}/sub-categories/`);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const supplementAPI = new SupplementAPI(httpAuthService);
