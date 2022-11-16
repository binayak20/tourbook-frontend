import config from '@/config';
import { authService } from '../auth';
import { DashboardSummaryReport } from './@types';
import { HttpAuthService } from './httpService';

class DashboardAPI {
	constructor(private http: HttpAuthService) {}

	summary() {
		return this.http.get<DashboardSummaryReport>('dashboard-summary-report/');
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const dashboardAPI = new DashboardAPI(httpAuthService);
