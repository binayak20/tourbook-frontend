import config from '@/config';
import { authService } from '../auth';
import {
	Booking,
	BookingCostPayload,
	BookingCostResponse,
	BookingCreatePayload,
	BookingParams,
	Pagination,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class BookingsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: BookingParams = {}) {
		const paginateURL = this.setURL('bookings/').params(params).getURL();
		return this.http.get<Pagination<Booking[]>>(paginateURL);
	}

	create(payload: BookingCreatePayload) {
		return this.http.post<Booking>('tour-bookings/', payload);
	}

	calculateCost(payload: BookingCostPayload) {
		return this.http.post<BookingCostResponse>('tour-bookings/cost-preview/', payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const bookingsAPI = new BookingsAPI(httpAuthService);
