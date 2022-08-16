import config from '@/config';
import { authService } from '../auth';
import {
	Pagination,
	Supplement,
	SupplementCategory,
	SupplementCategoryCreatePayload,
} from './@types';
import { HttpAuthService } from './httpService';

class TourAPI {
	constructor(private http: HttpAuthService) {}

	// Supplement APIs
	supplements() {
		return this.http.get<Pagination<Supplement[]>>('supplements/');
	}

	supplementCategories() {
		return this.http.get<Pagination<SupplementCategory[]>>('supplement-categories/');
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
export const tourAPI = new TourAPI(httpAuthService);
