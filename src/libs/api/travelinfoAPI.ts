/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@/config';
import { authService } from '../auth';
import { CreateTravelInfo, PaginateParams, Pagination } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class TravelInfoAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}
	getTravelInfoTypeList({ page, limit }: PaginateParams) {
		const paginateURL = this.setURL('travel-information-types/').paginate(page, limit).getURL();
		return this.http.get<Pagination<API.TravelInfoType[]>>(paginateURL);
	}
	getTravelInfoList({ page, limit }: PaginateParams) {
		const paginateURL = this.setURL('travel-informations/').paginate(page, limit).getURL();
		return this.http.get<Pagination<API.TravelInfo[]>>(paginateURL);
	}
	createTravelInfo(payload: CreateTravelInfo) {
		return this.http.post<API.TravelInfo>('travel-informations/', payload);
	}

	updateTravelInfo(ID: number, payload: CreateTravelInfo) {
		return this.http.put<API.TravelInfo>(`travel-informations/${ID}/`, payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const travelInfoAPI = new TravelInfoAPI(httpAuthService);
