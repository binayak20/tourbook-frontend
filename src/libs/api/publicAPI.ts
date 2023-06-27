import config from '@/config';
import { ISearchCriteria, Pagination, Tour } from './@types';
import { Common } from './common';
import { HttpService } from './httpService';

class PublicAPI extends Common {
	constructor(private http: HttpService) {
		super(config.itemsPerPage);
	}
	tours(params: any) {
		const paginateURL = this.setURL('public/tours/').params(params).getURL();
		return this.http.get<Pagination<Tour[]>>(paginateURL);
	}
	tour(id: string) {
		return this.http.get<API.Tour>(`public/tours/${id}/`);
	}
	availableDates(params: any) {
		const url = this.setURL('public/tours/available-dates/').params(params, false).getURL();
		return this.http.get<{ available_dates: string[] }>(url);
	}
	searchCriteria() {
		return this.http.get<ISearchCriteria>('public/tours/search-criteria/');
	}
	configuration() {
		return this.http.get<API.LoginConfig>('loginpage-configuration/');
	}
	createBooking(data: any) {
		return this.http.post<API.Booking>('public/tour-bookings/', data);
	}
	verifyCoupon(
		id: number,
		data: {
			code: string;
		}
	) {
		return this.http.post<{
			is_valid: boolean;
			discount: number;
			discount_type: 'amount' | 'percentage';
		}>(`public/validate-tour-coupons/${id}/`, data);
	}
}
const httpService = new HttpService(config.apiURL);
export const publicAPI = new PublicAPI(httpService);
