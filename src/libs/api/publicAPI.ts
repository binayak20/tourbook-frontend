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
	availableDates(params: any) {
		const url = this.setURL('public/tours/available-dates/').params(params, false).getURL();
		return this.http.get<{ available_dates: string[] }>(url);
	}
	searchCriteria() {
		return this.http.get<ISearchCriteria>(`public/tours/search-criteria/`);
	}
	configuration() {
		return this.http.get<API.LoginConfig>('loginpage-configuration/');
	}
}
const httpService = new HttpService(config.apiURL);
export const publicAPI = new PublicAPI(httpService);
