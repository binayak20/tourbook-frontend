import config from '@/config';
import { authService } from '../auth';
import {
	PaginateParams,
	Pagination,
	Station,
	StationCreateResponse,
	StationPayload,
	StationsParams,
	StationType,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class StationsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: StationsParams = {}) {
		const paginateURL = this.setURL('stations/').params(params).getURL();
		return this.http.get<Pagination<Station[]>>(paginateURL);
	}

	getOne(ID: number) {
		return this.http.get<Station>(`stations/${ID}/`);
	}

	create(payload: StationPayload) {
		return this.http.post<StationCreateResponse>('stations/', payload);
	}

	update(ID: number, payload: StationPayload) {
		return this.http.put<StationCreateResponse>(`stations/${ID}/`, payload);
	}

	types(params: PaginateParams = {}) {
		const paginateURL = this.setURL('station-types/').params(params).getURL();
		return this.http.get<Pagination<StationType[]>>(paginateURL);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const stationsAPI = new StationsAPI(httpAuthService);
