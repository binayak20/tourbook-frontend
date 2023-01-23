import { PaginateParams } from './common';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CountryParams extends PaginateParams {
	name?: string;
	territory?: number;
	is_active?: boolean;
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
	territory: Territory;
}

export interface LocationParams extends PaginateParams {
	name?: string;
	territory?: number;
	country?: number;
	is_active?: boolean;
}

export interface LocationType {
	id: number;
	country: Country;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	description?: any;
	created_by: number;
	updated_by: number;
}

export interface LocationCreatePayload {
	name: string;
	country: number;
	territory: number;
}
