import { PaginateParams } from './common';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TransactionsParams extends PaginateParams {
	name?: string;
	payment_method?: string;
	currency?: string;
	status?: string;
	sattlement_status?: string;
	booking_type?: string;
	booking?: string;
}

interface User {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	is_active: boolean;
}

interface Currency {
	id: number;
	currency_code: string;
	name: string;
	country_name: string;
}

interface PaymentMethod {
	id: number;
	name: string;
	logo?: any;
	is_available: boolean;
	is_active: boolean;
}

export interface Transactions {
	id: number;
	user: User;
	currency: Currency;
	payment_method: PaymentMethod;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	amount: number;
	first_name: string;
	last_name: string;
	payment_address?: any;
	invoice_no?: any;
	is_sent_to_fortnox: boolean;
	is_acknowledged: boolean;
	status: string;
	settlement_status: string;
	currency_code: string;
	booking: number;
}
