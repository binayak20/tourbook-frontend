import { PaginateParams } from './common';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface EmailLog {
	id: number;
	email_provider: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	from_email?: any;
	to_email: string;
	subject?: any;
	response: string;
	date_sent: string;
	status_code?: any;
	headers?: any;
	template_data?: any;
	template_id?: any;
	is_success: boolean;
	created_by?: any;
	updated_by?: any;
	email_event?: any;
	booking?: any;
}
export interface EventEmail {
	id: number;
	name: string;
	slug: string;
	description?: string;
	is_active: boolean;
}
export interface EmailLogsParams extends PaginateParams {
	to_email?: string;
	email_event?: string;
}
export interface FortnoxLogsParams extends PaginateParams {
	booking_reference?: string;
	voucher_number?: string;
	fortnox_event?: string;
}

export interface ScheduledEmail {
	id: number;
	object_id: number;
	content_type: number;
	send_on: string;
	event: string;
	to_email: string;
	to_cc: any;
	to_bcc: any;
	dynamic_data: DynamicData;
	is_email_sent: boolean;
	send_at: any;
	is_active: boolean;
}
export interface DynamicData {
	reference?: string;
	return_date: string;
	booking_name?: string;
	departure_date: string;
	primary_passenger?: string;
	number_of_passenger?: string;
	full_name?: string;
	first_name?: string;
	booking_reference?: string;
	customer_portal_link?: string;
}

export interface ScheduledEmailListParams extends PaginateParams {
	to_email?: string;
	event?: string;
}
