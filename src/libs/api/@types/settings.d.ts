type Response = {
	count: 0;
	next: string;
	previous: string;
};

// Airport Types
export type Airport = {
	id: number;
	name: string;
	description: string;
	airport_code: string;
	is_active: boolean;
};
export interface AirportsResponse extends Response {
	results: Airport[];
}
export interface AirportCreatePayload {
	name: string;
	airport_code: string;
	description: string;
	transfer_cost: number;
	additional_transfer_cost: number;
}
export interface AirportUpdatePayload {
	name: string;
	airport_code: string;
	description: string;
	transfer_cost: number;
	additional_transfer_cost: number;
}

// Category Types
export type Category = {
	id: number;
	parent: number;
	name: string;
	slug: string;
	is_active: boolean;
};
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

// Territory Types
export type Territory = {
	id: number;
	name: string;
	is_active: boolean;
};

export interface TerritoriesResponse extends Response {
	results: Territory[];
}

export interface TerritoryCreateUpdatePayload {
	name: string;
}

// Locations Types
export type Location = {
	id: number;
	name: string;
	territory: number;
	is_active: boolean;
};
export interface LocationsResponse extends Response {
	results: Location[];
}
export interface LocationCreateUpdatePayload {
	name: string;
	territory: number;
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
}

export interface Accomodation {
	id: number;
	name: string;
	address: string;
	description: string;
	website_url: string;
	is_active: boolean;
}

export interface AccomodationsResponse extends Response {
	results: Accomodation[];
}

export interface AccomodationCreateUpdatePayload {
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
