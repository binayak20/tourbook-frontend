import config from '@/config';
import { authService } from '../auth';
import {
	FortnoxAccountPayload,
	FortnoxAccountResponse,
	FortnoxAccounts,
	FortnoxCostCenter,
	FortnoxEvent,
	FortnoxScenario,
	PaginateParams,
	Pagination,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class FortnoxAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	events({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('fortnox-events/').paginate(page, limit).getURL();
		return this.http.get<Pagination<FortnoxEvent[]>>(paginateURL);
	}

	scenarios({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('fortnox-scenarios/').paginate(page, limit).getURL();
		return this.http.get<Pagination<FortnoxScenario[]>>(paginateURL);
	}

	costCenters({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('fortnox-cost-centers/').paginate(page, limit).getURL();
		return this.http.get<Pagination<FortnoxCostCenter[]>>(paginateURL);
	}

	fortnoxAccounts({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('fortnox-accounts/').paginate(page, limit).getURL();
		return this.http.get<Pagination<FortnoxAccounts[]>>(paginateURL);
	}

	createFortnoxAccount(payload: FortnoxAccountPayload) {
		return this.http.post<FortnoxAccountResponse>('fortnox-accounts/', payload);
	}

	updateFortnoxAccount(ID: number, payload: FortnoxAccountPayload) {
		return this.http.put<FortnoxAccountResponse>(`fortnox-accounts/${ID}/`, payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const fortnoxAPI = new FortnoxAPI(httpAuthService);