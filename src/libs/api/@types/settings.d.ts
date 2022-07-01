type Response = {
	count: 0;
	next: string;
	previous: string;
};

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

export interface AirporCreateResponse {
	id: number;
	name: string;
	description: string;
	airport_code: string;
	is_active: boolean;
}
