export interface StationsParams {
	page?: number;
	name?: string;
	station_type?: string;
	is_active?: boolean;
}

export interface Station {
	id: number;
	parent?: number;
	name: string;
	slug: string;
	is_active: boolean;
}
