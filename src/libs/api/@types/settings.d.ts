/* eslint-disable @typescript-eslint/no-explicit-any */
interface Response {
	count: 0;
	next: string;
	previous: string;
}

// Category Types

export interface Parent {
	id: number;
	name: string;
}
export interface Category {
	id: number;
	parent: Parent;
	name: string;
	slug: string;
	is_active: boolean;
}
export interface CategoriesResponse extends Response {
	results: Category[];
}
export interface CategoryCreatePayload {
	id: number;
	parent: number;
	name: string;
	slug: string;
	is_active: boolean;
}

export interface CategoryUpdatePayload {
	parent: number;
	name: string;
}

interface EmailProvider {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	slug: string;
	logo?: any;
	created_by?: any;
	updated_by?: any;
}

export interface Configuration {
	id: number;
	default_currency: string;
	default_currency_id: number;
	logo: string;
	favicon: string;
	login_page_bg_image?: any;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	company_name: string;
	organization_number: string;
	color_code: string;
	website: string;
	email: string;
	admin_email: string;
	telephone: string;
	booking_fee: number;
	first_payment_day: number;
	residue_payment_day: number;
	passenger_content_update_days: number;
	passenger_schedule_mail_send_days: number;
	s3_bucket_name: string;
	domain_admin_portal: string;
	domain_customer_portal: string;
	created_by?: any;
	updated_by?: any;
	email_provider: EmailProvider;
	accounting_service_provider?: any;
	fortnox_client_id?: string;
	fortnox_client_credentials?: string;
	fortnox_scope: string;
	fortnox_state: string;
	fortnox_access_type: string;
	fortnox_response_type: string;
	fortnox_account_type: string;
	bank_giro_number: string;
	invoice_payment_days: number | null;
	second_payment_fee: number;
	tour_default_image: any;
}

export interface ConfigurationFileUpload {
	field_name: string;
	file_object: object;
}

export interface Accommodation {
	id: number;
	name: string;
	address: string;
	description: string;
	website_url: string;
	is_active: boolean;
}

export interface AccommodationsResponse extends Response {
	results: Accommodation[];
}

export interface AccommodationCreateUpdatePayload {
	name: string;
	address: string;
	description: string;
	website_url: string;
}

export interface UserRole {
	id: number;
	name: string;
	permissions: number[];
	hidden_permissions?: number[];
	total_permission: number;
	total_user: number;
}

export interface Permission {
	id: number;
	name: string;
	content_type_id?: number;
	codename: string;
}

export interface PermissionsResponse {
	id: number;
	app_label: string;
	model: string;
	model_name: string;
	permissions: Permission[];
}

export interface UserRole {
	id: number;
	name: string;
	permissions: number[];
	total_permission: number;
	total_user: number;
}

export type UserRolePayload = Omit<UserRole, 'id' | 'total_permission' | 'total_user'>;
