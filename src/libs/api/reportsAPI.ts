import config from '@/config';
import { authService } from '../auth';

import { Common } from './common';
import { HttpAuthService } from './httpService';

class ReportsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	salesReportDownload(dates: { fromDate: string; toDate: string }, dateRangeType?: string) {
		const { fromDate, toDate } = dates;
		const payload = {
			from_date: fromDate,
			to_date: toDate,
		};

		return this.http.post<Blob>(`${dateRangeType}/`, payload, {
			headers: {
				'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			},
		});
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const reportsAPI = new ReportsAPI(httpAuthService);
