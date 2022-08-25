import config from '@/config';
import { authService } from '../auth';
import {
	Pagination,
	Tour,
	TourCategoriesParams,
	TourCategory,
	TourCreatePayload,
	TourType,
	TourTypeCreatePayload,
	TourTypeCreateResponse,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class ToursAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'tours/');
		return this.http.get<Pagination<Tour[]>>(paginateURL);
	}

	tour(ID: number) {
		return this.http.get<Tour>(`tours/${ID}`);
	}

	create(payload: TourCreatePayload) {
		return this.http.post<Tour>('tours/', payload);
	}

	update(ID: number, payload: TourCreatePayload) {
		return this.http.put<Tour>(`tours/${ID}/`, payload);
	}

	updateStatus(ID: number, is_active: boolean) {
		return this.http.patch<Tour>(`tours/${ID}/update-status/`, { is_active });
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

	tourTypes(page = 1) {
		const paginateURL = this.getPaginateURL(page, 'tour-types/');
		return this.http.get<Pagination<TourType[]>>(paginateURL);
	}

	tourType(ID: number) {
		return this.http.get<TourType>(`tour-types/${ID}/`);
	}

	createType(payload: TourTypeCreatePayload) {
		return this.http.post<TourTypeCreateResponse>('tour-types/', payload);
	}

	updateTourType(ID: number, payload: TourTypeCreatePayload) {
		return this.http.put<TourTypeCreateResponse>(`tour-types/${ID}/`, payload);
	}

	updateTourTypeStatus(ID: number, is_active: boolean) {
		return this.http.patch<TourTypeCreateResponse>(`tour-types/${ID}/update-status/`, {
			is_active,
		});
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const toursAPI = new ToursAPI(httpAuthService);
