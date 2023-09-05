/* eslint-disable @typescript-eslint/ban-types */
import config from '@/config';
import { authService } from '../auth';
import {
	EmailLog,
	EmailLogsParams,
	EventEmail,
	FortnoxLog,
	FortnoxLogsParams,
	PaginateParams,
	Pagination,
	ScheduledEmail,
	ScheduledEmailListParams,
} from './@types';

import { Common } from './common';
import { HttpAuthService } from './httpService';

class LogsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}
	// Logs (Email)
	emailLogs(params: EmailLogsParams = {}) {
		const paginateURL = this.setURL(`email-logs/`).params(params).getURL();
		return this.http.get<Pagination<EmailLog[]>>(paginateURL);
	}
	// Logs (Fortnox)
	fortnoxLogs(params: FortnoxLogsParams = {}) {
		const paginateURL = this.setURL(`fortnox-logs/`).params(params).getURL();
		return this.http.get<Pagination<FortnoxLog[]>>(paginateURL);
	}

	sheduledEmailList(EmailListParam: ScheduledEmailListParams = {}) {
		const paginateURL = this.setURL(`scheduled-emails/`).params(EmailListParam).getURL();
		return this.http.get<Pagination<ScheduledEmail[]>>(paginateURL);
	}
	singleFortnoxLog(LogId: number | null) {
		return this.http.get<FortnoxLog>(`fortnox-logs/${LogId}`);
	}
	eventEmails({ page, limit }: PaginateParams = {}) {
		const paginateURL = this.setURL(`email-events/`).paginate(page, limit).getURL();
		return this.http.get<Pagination<EventEmail[]>>(paginateURL);
	}
	downloadEventEmail(ID: string) {
		return this.http.post<Blob>(`email-logs/download/`, { email_event: ID });
	}
	singleEmailLog(LogId: number | null) {
		return this.http.get<EmailLog>(`email-logs/${LogId}`);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const logsAPI = new LogsAPI(httpAuthService);
