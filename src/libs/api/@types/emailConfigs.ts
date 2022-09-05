/* eslint-disable @typescript-eslint/no-explicit-any */
export interface EmailProvider {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	slug?: any;
	logo?: any;
	created_by?: any;
	updated_by?: any;
}

export interface EmailEventTemplate {
	id: number;
	email_event_name: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	template_id: string;
	created_by?: any;
	updated_by?: any;
	email_event: number;
	email_provider: number;
}

export interface EmailProviderConfig {
	id: number;
	email_provider: EmailProvider;
	api_key: string;
	username?: any;
	password?: any;
	base_url?: any;
	from_email: string;
	is_active: boolean;
	email_event_template: EmailEventTemplate[];
}

export interface EmailProviderConfigPayload {
	email_provider: number;
	api_key: string;
	username: any;
	password: any;
	base_url: string;
	from_email: string;
}

export interface EmailTeamplatePayload {
	id: number;
	email_event: number;
	email_provider: number;
	template_id: number | string;
}
