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
export interface AirporCreateUpdateResponse {
	id: number;
	name: string;
	description: string;
	airport_code: string;
	is_active: boolean;
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

export interface CategoryCreateUpdateResponse {
	id: number;
	parent: number;
	name: string;
	slug: string;
	is_active: boolean;
}
