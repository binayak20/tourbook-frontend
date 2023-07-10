import { PaginateParams } from './common';
import { TravelInfo } from './travelinfo';

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
	travel_information: TravelInfo;
}

export interface LocationCreatePayload {
	name: string;
	country: number;
	territory: number;
}

export interface PickupLocationCreatePayload {
	name: string;
	description?: string;
	location: number;
}

export interface Location {
	id: number;
	name: string;
	country: Country;
	territory: Territory;
}

export interface PickupLocationArea {
	id: number;
	name: string;
}

export interface PickupLocation {
	id: number;
	is_active: boolean;
	name: string;
	description?: any;
	pickup_location_area: PickupLocationArea;
}

export interface pickupLocationParams extends PaginateParams {
	location?: number;
	tour?: number;
	id?: number;
	pickup_location_area?: number;
}
