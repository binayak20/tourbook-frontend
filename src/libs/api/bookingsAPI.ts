import config from '@/config';
import { authService } from '../auth';
import {
	Booking,
	BookingCostPayload,
	BookingCostResponse,
	BookingCreatePayload,
	BookingParams,
	BookingPassengerCreatePayload,
	BookingPassengerCreateResponse,
	BookingSingle,
	BookingUpdatePayload,
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

	get(ID: number) {
		return this.http.get<BookingSingle>(`bookings/${ID}`);
	}

	create(payload: BookingCreatePayload) {
		return this.http.post<Booking>('tour-bookings/', payload);
	}

	update(ID: number, payload: BookingUpdatePayload) {
		return this.http.put<Booking>(`tour-bookings/${ID}/update/`, payload);
	}

	cancel(ID: number) {
		return this.http.put<{ detail: string }>(`bookings/${ID}/cancel/`, {});
	}

	calculateCost(payload: BookingCostPayload) {
		return this.http.post<BookingCostResponse>('tour-bookings/cost-preview/', payload);
	}

	createPassenger(ID: number, payload: BookingPassengerCreatePayload) {
		return this.http.post<BookingPassengerCreateResponse>(
			`bookings/${ID}/passengers/create/`,
			payload
		);
	}

	updatePassenger(ID: number, passengerID: number, payload: BookingPassengerCreatePayload) {
		return this.http.put<BookingPassengerCreateResponse>(
			`bookings/${ID}/passengers/${passengerID}/`,
			payload
		);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const bookingsAPI = new BookingsAPI(httpAuthService);
