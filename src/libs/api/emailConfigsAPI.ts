import config from '@/config';
import { authService } from '../auth';
import {
	EmailProvider,
	EmailProviderConfig,
	EmailProviderConfigPayload,
	PaginateParams,
	Pagination,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class EmailConfigsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	emailProviderConfig(params: PaginateParams = {}) {
		const paginateURL = this.setURL(`email-provider-configurations/`).params(params).getURL();
		return this.http.get<Pagination<EmailProviderConfig[]>>(paginateURL);
	}

	unconfiguredEmailProviders() {
		return this.http.get<EmailProvider[]>(`unconfigured-email-providers/`);
	}

	createEmailProviderConfig(payload: EmailProviderConfigPayload) {
		return this.http.post<Pagination<EmailProviderConfig[]>>(
			`email-provider-configurations/`,
			payload
		);
	}

	updateEmailProviderConfig(ID: number, payload: EmailProviderConfigPayload) {
		return this.http.put<Pagination<EmailProviderConfig[]>>(
			`email-provider-configurations/${ID}/`,
			payload
		);
	}

	updateEmailTemplates(payload: API.EmailTeamplatePayload[]) {
		return this.http.put<EmailProviderConfig['email_event_template']>(
			`email-event-templates/`,
			payload
		);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const emailConfigsAPI = new EmailConfigsAPI(httpAuthService);
