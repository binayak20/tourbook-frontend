interface Response {
	count: 0;
	next: string;
	previous: string;
}

// Category Types
export interface Category {
	id: number;
	parent: number;
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

export interface Configuration {
	admin_email: string;
	booking_fee: number;
	company_name: string;
	default_currency: string;
	email: string;
	favicon: string;
	first_payment_day: number;
	is_active: boolean;
	login_page_bg_image: string;
	logo: string;
	passenger_content_update_days: number;
	passenger_schedule_mail_send_days: number;
	residue_payment_day: number;
	telephone: string;
	website: string;
	default_currency: string;
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
