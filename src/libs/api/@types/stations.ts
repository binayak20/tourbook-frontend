/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateParams } from './common';

export interface StationsParams extends PaginateParams {
	name?: string;
	station_type?: number;
	is_active?: boolean;
	tour?: number;
}

export interface StationPayload {
	name: string;
	station_type: number;
	description: string;
	station_code: string;
}

export interface StationCreateResponse {
	id: number;
	name: string;
	station_type: number;
	description: string;
	station_code: string;
	is_active: boolean;
}

export interface StationType {
	id: number;
	name: string;
	is_active: boolean;
}

export interface Station {
	id: number;
	name: string;
	description?: any;
	station_code: string;
	is_active: boolean;
	station_type: StationType;
}
