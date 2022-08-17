import config from '@/config';
import { authService } from '../auth';
import { Pagination, TourCategoriesParams, TourCategory } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class ToursAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	categories({ page = 1, name, parent, is_active }: TourCategoriesParams = { page: 1 }) {
		const paginateURL = this.getPaginateURL(page, 'categories/');

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
		const url = parmasToString ? `${paginateURL}?${parmasToString}` : paginateURL;
		return this.http.get<Pagination<TourCategory[]>>(url);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const toursAPI = new ToursAPI(httpAuthService);
