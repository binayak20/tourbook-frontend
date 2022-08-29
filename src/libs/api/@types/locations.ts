export interface CountryParams {
	name?: string;
	territory?: number;
	is_active?: boolean;
	page?: number;
	limit?: number;
}

export interface TerritoryParams {
	page?: number;
	limit?: number;
}

export interface Territory {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	created_by?: any;
	updated_by?: any;
}

export interface Country {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	country_code: string;
	created_by?: any;
	updated_by?: any;
	territory: number;
}

export interface LocationParams {
	page?: number;
	name?: string;
	territory?: number;
	country?: number;
	is_active?: boolean;
	limit?: number;
}

export interface LocationType {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	created_by?: any;
	updated_by?: any;
	country: number;
	territory: number;
}

export interface LocationCreatePayload {
	name: string;
	country: number;
	territory: number;
}
