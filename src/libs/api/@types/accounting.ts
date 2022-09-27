/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AccountingServiceProvider {
	id: number;
	name: string;
	logo?: any;
	slug: string;
	is_active: boolean;
}

export interface AccountingConfig {
	id: number;
	auth_code: string;
	client_id: string;
	client_secret: string;
	access_token: string;
	base_url: string;
	accounting_service_provider: AccountingServiceProvider;
	is_active: boolean;
}
