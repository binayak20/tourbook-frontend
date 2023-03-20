import config from '@/config';
import { authService } from '../auth';
import {
	FortnoxAccountPayload,
	FortnoxAccountResponse,
	FortnoxAccounts,
	FortnoxCostCenter,
	FortnoxEvent,
	FortnoxProject,
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

	fetchCostCenters() {
		return this.http.post<{ detail: string }>('fortnox-cost-centers/fetch/', {});
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

	projects({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL('fortnox-projects/').paginate(page, limit).getURL();
		return this.http.get<Pagination<FortnoxProject[]>>(paginateURL);
	}

	fetchProjects() {
		return this.http.post<{ detail: string }>('fortnox-projects/fetch/', {});
	}

	config(payload: Record<string, string>) {
		return this.http.post<{ details: string }>('fortnox-configure/', payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const fortnoxAPI = new FortnoxAPI(httpAuthService);
