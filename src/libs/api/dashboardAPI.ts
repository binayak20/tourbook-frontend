import config from '@/config';
import { authService } from '../auth';
import { DashboardSummaryReport, RemainingPayment } from './@types';
import { HttpAuthService } from './httpService';

class DashboardAPI {
	constructor(private http: HttpAuthService) {}

	summary() {
		return this.http.get<DashboardSummaryReport>('dashboard-summary-report/');
	}
	remainingPayment(selected: string) {
		return this.http.get<RemainingPayment[]>(
			`remaining-payment-deadline-report/?deadline_type=${selected}`
		);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const dashboardAPI = new DashboardAPI(httpAuthService);
