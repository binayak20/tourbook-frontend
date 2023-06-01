import config from '@/config';
import { authService } from '../auth';
import {
	BookingTour,
	Coupon,
	PaginateParams,
	Pagination,
	Tour,
	TourCategoriesParams,
	TourCategory,
	TourCreatePayload,
	ToursParams,
	TourTag,
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
	bookingListOfTours(tourId: number) {
		const paginateURL = this.setURL(`tours/${tourId}/bookings`).getURL();
		return this.http.get<BookingTour[]>(paginateURL);
	}

	bookingListXlDownload(tourId: number) {
		return this.http.get<Blob>(`tours/${tourId}/bookings-report-excel-download/`, {
			headers: {
				'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			},
		});
	}

	list(params: ToursParams = {}) {
		const paginateURL = this.setURL('tours/').params(params).getURL();
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

	categories(params: TourCategoriesParams = {}) {
		const paginateURL = this.setURL('categories/').params(params).getURL();
		return this.http.get<Pagination<TourCategory[]>>(paginateURL);
	}

	tourTypes(params: PaginateParams = {}) {
		const paginateURL = this.setURL('tour-types/').params(params).getURL();
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

	tags({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('tour-tags/').paginate(page, limit).getURL();
		return this.http.get<Pagination<TourTag[]>>(paginateURL);
	}

	coupons(ID: number) {
		return this.http.get<Coupon[]>(`tours/${ID}/coupons/`);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const toursAPI = new ToursAPI(httpAuthService);
