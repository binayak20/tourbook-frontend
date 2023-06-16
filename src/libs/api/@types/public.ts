export interface ISearchCriteria {
	departure_date: string[];
	locations: {
		name: string;
		id: number;
	}[];
	remaining_capacity: number[];
	categories: {
		name: string;
		id: number;
	}[];
	countries: {
		name: string;
		id: number;
	}[];
	destinations: {
		country_id: number;
		location_id: number;
		name: string;
	}[];
}
