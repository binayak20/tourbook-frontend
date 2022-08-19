export interface StationsParams {
	page?: number;
	name?: string;
	station_type?: number;
	is_active?: boolean;
}

export interface Station {
	id: number;
	parent?: number;
	name: string;
	slug: string;
	is_active: boolean;
}

export interface StationTypeItem {
	id: number;
	name: string;
	is_active: boolean;
}
