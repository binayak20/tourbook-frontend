/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UnconfiguredPaymentMethod {
	id: number;
	name: string;
	logo?: string;
	is_available: boolean;
	is_active: boolean;
}

export interface PaymentConfigMethod {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	logo?: any;
	is_available: boolean;
	created_by?: any;
	updated_by?: any;
}

export interface PaymentConfig {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	username: string;
	password: string;
	base_url: string;
	success_url: string;
	notification_url: string;
	private_key_name: string;
	created_by?: any;
	updated_by?: any;
	payment_method: PaymentConfigMethod;
}

export interface PaymentConfigCreatePayload {
	payment_method: number;
	username: string;
	password: string;
	base_url: string;
	success_url: string;
	notification_url: string;
	private_key_name: string;
}

export interface PaymentConfigCreateResponse extends PaymentConfigCreatePayload {
	id: number;
	is_active: boolean;
	created_by?: any;
	updated_by?: any;
}

export interface PaymentReminderPayload {
	deadline_type: string;
}

export interface PaymentReminderCreateResponse {
	detail: string;
}
