import config from '@/config';
import { authService } from '../auth';
import {
	PaginateParams,
	Pagination,
	PaymentConfig,
	PaymentConfigCreatePayload,
	PaymentConfigCreateResponse,
	PaymentReminderCreateResponse,
	UnconfiguredPaymentMethod,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class PaymentConfigsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	// Payment configurations
	unconfiguredPaymentMethods() {
		return this.http.get<UnconfiguredPaymentMethod[]>(`unconfigured-payment-methods/`);
	}

	paymentConfigurations({ page, limit }: PaginateParams) {
		const paginateURL = this.setURL(`payment-method-configurations/`)
			.paginate(page, limit)
			.getURL();
		return this.http.get<Pagination<PaymentConfig[]>>(paginateURL);
	}

	createPaymentConfig(payload: PaymentConfigCreatePayload) {
		return this.http.post<PaymentConfigCreateResponse>(`payment-method-configurations/`, payload);
	}

	updatePaymentConfig(ID: number, payload: PaymentConfigCreatePayload) {
		return this.http.put<PaymentConfigCreateResponse>(
			`payment-method-configurations/${ID}/`,
			payload
		);
	}

	updatePaymentConfigStatus(ID: number, is_active: boolean) {
		return this.http.patch<Pagination<PaymentConfig[]>>(
			`payment-method-configurations/${ID}/update-status/`,
			{ is_active }
		);
	}

	sendPaymentReminder(ID: number, payload: { deadline_type: string }) {
		return this.http.post<PaymentReminderCreateResponse>(
			`bookings/${ID}/send-payment-reminder/`,
			payload
		);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const paymentConfigsAPI = new PaymentConfigsAPI(httpAuthService);
