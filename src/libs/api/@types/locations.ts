export interface Country {
	id: number;
	name: string;
	country_code: string;
	is_active: boolean;
}

export interface Territory {
	id: number;
	name: string;
	type: number;
	capacity: number;
	description?: string;
	is_active: boolean;
}

export interface LocationParams {
	page?: number;
	name?: string;
	territory?: number;
	is_active?: boolean;
}

export interface LocationType {
	id: number;
	name: string;
	territory: number;
	is_active: boolean;
}
