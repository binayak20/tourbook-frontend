import config from '@/config';
import { authService } from '../auth';

import { Common } from './common';
import { HttpAuthService } from './httpService';

class ReportsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	// salesReportDownload(dates: { fromDate: string; toDate: string }) {
	// 	//   const fromDateObj = new Date(fromDate);
	// 	// const toDateObj = new Date(toDate);
	// 	return this.http.get<Blob>(`sales-report-on-departure-date/`, {
	// 		headers: {
	// 			'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	// 		},
	// 		params: dates,
	// 		// params: {
	// 		//   fromDate: fromDateObj.toISOString(),
	// 		//   toDate: toDateObj.toISOString(),
	// 		// },
	// 	});
	// }
	salesReportDownload(dates: { fromDate: string; toDate: string }) {
		const { fromDate, toDate } = dates;
		const queryString = `?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(
			toDate
		)}`;

		return this.http.get<Blob>(`sales-report-on-departure-date/${queryString}`, {
			headers: {
				'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			},
		});
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const reportsAPI = new ReportsAPI(httpAuthService);
