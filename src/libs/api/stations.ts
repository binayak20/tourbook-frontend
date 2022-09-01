/* eslint-disable @typescript-eslint/no-explicit-any */

export interface StationType {
	id: number;
	name: string;
	is_active: boolean;
}

export interface StationPayload {
	name: string;
	station_type: number;
}

export interface Station {
	id: number;
	name: string;
	description?: any;
	station_code: string;
	is_active: boolean;
	station_type: StationType;
}
