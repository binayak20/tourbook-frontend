export interface TourCategoriesParams {
	name?: string;
	parent?: number;
	is_active?: boolean;
}

export interface TourCategory {
	id: number;
	parent?: number;
	name: string;
	slug: string;
	is_active: boolean;
}

export interface TourTypeCreatePayload {
	name: string;
	description: string;
	duration: number;
	capacity: number;
	currency: number;
	standard_price: number;
	transfer_price: number;
	cancel_fee_percent: number;
	travel_insurance_percent: number;
	booking_fee_percent: number;
	territory: number;
	location: number;
	tour_type_category: number;
	supplements: number[];
	vehicles: number[];
	stations: number;
	country: number;
	fortnox_cost_center: number;
}

export interface TourTypeCreateResponse {
	name: string;
	description: string;
	duration: number;
	capacity: number;
	currency: number;
	standard_price: number;
	transfer_price: number;
	cancel_fee_percent: number;
	travel_insurance_percent: number;
	booking_fee_percent: number;
	booking_fee: number;
	territory: number;
	country: number;
	location: number;
	tour_type_category: number;
	supplements: number[];
	vehicles: number[];
	stations: number;
	fortnox_cost_center: number;
	is_active: boolean;
}
