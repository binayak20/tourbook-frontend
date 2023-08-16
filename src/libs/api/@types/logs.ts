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
