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
}
export interface AirportUpdatePayload {
	name: string;
	airport_code: string;
	description: string;
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

// Currency Types
export interface Currencies {
	id: number;
	currency_code: string;
	name: string;
	country_name: string;
}

export interface CurrencyFrom {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	currency_code: string;
	name: string;
	country_name?: string;
	created_by?: Date;
	updated_by?: Date;
}

export interface CurrencyTo {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	currency_code: string;
	name: string;
	country_name?: string;
	created_by?: Date;
	updated_by?: Date;
}

export interface CurrencyConversation {
	id: number;
	currency_from: CurrencyFrom;
	currency_to: CurrencyTo;
	rate: number;
}

export interface CurrencyConversationsResponse {
	count: number;
	next?: string;
	previous?: string;
	results: CurrencyConversation[];
}

export interface CurrencyConversationCreatePayload {
	currency_from: number;
	currency_to: number;
	rate: number;
}

export interface CurrenciesResponse {
	count: number;
	next?: string;
	previous?: string;
	results: Pick<CurrencyFrom, 'id' | 'currency_code' | 'name' | 'country_name'>[];
}
