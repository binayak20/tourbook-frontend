export interface TravelInfoType {
	id: number;
	name: string;
	is_active: boolean;
}

export interface TravelInfo {
	id: number;
	name: string;
	travel_information_type: number;
	information_text?: string | null;
	link?: string;
	is_active: boolean;
}

export interface CreateTravelInfo {
	name: string;
	travel_information_type: number;
	information_text?: string | null;
}
