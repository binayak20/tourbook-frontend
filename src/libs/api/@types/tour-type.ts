import { FortnoxProject } from './fortnox';
import { TravelInfo } from './travelinfo';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Currency {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	currency_code: string;
	name: string;
	country_name: string;
	created_by?: any;
	updated_by?: any;
}

interface Territory {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	created_by?: any;
	updated_by?: any;
}

interface Country {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	country_code: string;
	created_by?: any;
	updated_by?: any;
	territory: number;
}

interface Location {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	description?: any;
	created_by?: any;
	updated_by?: any;
	country: number;
	territory: number;
}

interface TourTypeCategory {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	slug: string;
	created_by?: any;
	updated_by?: any;
	parent?: any;
}

interface Supplement {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	description: string;
	price: number;
	quantity: number;
	unit_type: string;
	mandatory: boolean;
	is_calculate: boolean;
	created_by?: any;
	updated_by?: any;
	supplement_category: number;
}

interface Vehicle {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	capacity: number;
	description: string;
	created_by?: any;
	updated_by?: any;
	vehicle_type: number;
}

interface Station {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	description?: any;
	station_code?: any;
	created_by?: any;
	updated_by?: any;
	station_type: number;
}

interface StationType {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	created_by?: any;
	updated_by?: any;
}

interface Accommodation {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	address: string;
	description: string;
	website_url: string;
	created_by?: any;
	updated_by?: any;
}

interface FortnoxCostCenter {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	code: string;
	note?: any;
	created_by: number;
	updated_by?: any;
}

export interface TourType {
	id: number;
	name: string;
	description: string;
	duration: number;
	capacity: number;
	currency: Currency;
	standard_price: number;
	transfer_price: number;
	cancel_fee_percent: number;
	travel_insurance_percent: number;
	booking_fee_percent: number;
	booking_fee: number;
	territory: Territory;
	country: Country;
	location: Location;
	category: TourTypeCategory;
	supplements: Supplement[];
	vehicles: Vehicle[];
	stations: Station[];
	station_type: StationType;
	accommodations: Accommodation[];
	fortnox_cost_center: FortnoxCostCenter;
	fortnox_project: FortnoxProject;
	is_active: boolean;
	travel_information: TravelInfo;
}
