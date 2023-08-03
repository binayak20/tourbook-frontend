import config from '@/config';
import { authService } from '../auth';

import { ReportDateRangePayload, ReportYearPayload } from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class ReportsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	salesReportDownload(payload: ReportDateRangePayload, dateRangeType?: string) {
		return this.http.post<Blob>(`${dateRangeType}/`, payload);
	}
	paymentReportDownload(payload: ReportDateRangePayload, paymentType?: string) {
		return this.http.post<Blob>(`payment-deadline-report/?deadline=${paymentType}`, payload);
	}
	transactionReportDownload(payload: ReportDateRangePayload) {
		return this.http.post<Blob>(`transaction-report/`, payload);
	}
	bookingsRemainingPaymentReportDownload(payload: ReportYearPayload) {
		return this.http.post<Blob>(`booking-remaining-payment-report/`, payload);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const reportsAPI = new ReportsAPI(httpAuthService);
