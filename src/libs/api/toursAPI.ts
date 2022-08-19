import config from '@/config';
import { authService } from '../auth';
import { TourCategoriesParams, TourCategory } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class ToursAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	categories({ name, parent, is_active }: TourCategoriesParams = {}) {
		const params = new URLSearchParams();
		if (name) {
			params.append('name', name);
		}

		if (parent) {
			params.append('parent', parent.toString());
		}

		if (is_active !== undefined) {
			params.append('is_active', is_active.toString());
		}

		const parmasToString = params.toString();
		const url = parmasToString ? `categories/?${parmasToString}` : 'categories/';
		return this.http.get<TourCategory[]>(url);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const toursAPI = new ToursAPI(httpAuthService);
