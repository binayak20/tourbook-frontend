export interface TourTypeCreatePayload {
	name: string;
	description: string;
	duration: number;
	capacity: number;
	currency: number;
	standard_price: number;
	transfer_price: number;
	cancel_fee_percent?: number;
	travel_insurance_percent?: number;
	booking_fee_percent: number;
	territory: number;
	location: number;
	category?: number;
	accommodations: number[];
	supplements?: number[];
	vehicles: number[];
	station_type?: number;
	stations?: number[];
	country: number;
	fortnox_cost_center: number;
	fortnox_project?: number;
	travel_information: number;
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
	category: number;
	supplements: number[];
	vehicles: number[];
	stations: number;
	fortnox_cost_center: number;
	is_active: boolean;
	fortnox_project: number;
}
