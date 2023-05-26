/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@/config';
import { authService } from '../auth';
import { CouponParams, Pagination } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class CouponAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}
	list(Params: CouponParams) {
		const paginateURL = this.setURL('coupons/').params(Params).getURL();
		return this.http.get<Pagination<API.Coupon[]>>(paginateURL);
	}
	get(ID: string) {
		return this.http.get<API.Coupon>(`coupons/${ID}/`);
	}
	create(payload: API.CreateCoupon) {
		return this.http.post<API.Coupon>('coupons/', payload);
	}
	update(ID: string, payload: API.CreateCoupon) {
		return this.http.put<API.Coupon>(`coupons/${ID}/`, payload);
	}

	// updateTravelInfo(ID: number, payload: CreateTravelInfo) {
	// 	return this.http.put<API.TravelInfo>(`travel-informations/${ID}/`, payload);
	// }
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const couponAPI = new CouponAPI(httpAuthService);
