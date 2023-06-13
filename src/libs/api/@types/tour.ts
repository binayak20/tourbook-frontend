/* eslint-disable @typescript-eslint/no-explicit-any */

import { PaginateParams } from './common';
import { FortnoxProject } from './fortnox';
import { TravelInfo } from './travelinfo';

// Tour categories
export interface TourCategoriesParams extends PaginateParams {
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

// Tour
export interface ToursParams extends PaginateParams {
	tour_type?: string;
	territory?: string;
	country?: string;
	location?: string;
	duration?: number;
	remaining_capacity?: number;
	departure_date?: string;
	tour_tag?: string;
	is_departed?: string;
}

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

interface TourType {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	description: string;
	duration: number;
	capacity: number;
	standard_price: number;
	transfer_price: number;
	cancel_fee_percent: number;
	travel_insurance_percent: number;
	booking_fee_percent: number;
	booking_fee: number;
	created_by?: any;
	updated_by?: any;
	currency: number;
	territory: number;
	country: number;
	location: number;
	category: number;
	station_type: number;
	fortnox_cost_center: number;
	supplements: number[];
	vehicles: number[];
	stations: number[];
	accommodations: any[];
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

interface StationType {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	created_by?: any;
	updated_by?: any;
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
	note: string;
	created_by?: any;
	updated_by?: any;
}

export interface Tour {
	id: number;
	name: string;
	description: string;
	duration: number;
	capacity: number;
	remaining_capacity: number;
	departure_date: string;
	return_date: string;
	is_reserved: boolean;
	reservation_expiry_date?: any;
	reserved_capacity?: any;
	currency: Currency;
	standard_price: number;
	transfer_price: number;
	cancel_fee_percent: number;
	travel_insurance_percent: number;
	booking_fee_percent: number;
	booking_fee: number;
	tour_tag: TourTag;
	territory: Territory;
	country: Country;
	location: Location;
	tour_type: TourType;
	supplements: Supplement[];
	vehicles: Vehicle[];
	station_type: StationType;
	stations: Station[];
	accommodations: Accommodation[];
	fortnox_cost_center: FortnoxCostCenter;
	is_departed: boolean;
	is_sent_to_fortnox_after_departure: boolean;
	is_active: boolean;
	is_repeat: boolean;
	repeat_interval?: number;
	repeat_type?: string;
	repeat_for?: number;
	number_of_booking_passenger: number;
	cancel_fee: number;
	is_private: boolean;
	fortnox_project: FortnoxProject;
	travel_information: TravelInfo | null;
	category: TourCategory;
}

export interface TourCreatePayload {
	name: string;
	description?: string;
	duration: number;
	capacity: number;
	number_of_bookings: number;
	departure_date: string;
	return_date: string;
	is_reserved: boolean;
	reservation_expiry_date?: string;
	reserved_capacity?: number;
	currency: number;
	standard_price: number;
	transfer_price: number;
	cancel_fee_percent?: number;
	travel_insurance_percent?: number;
	booking_fee_percent: number;
	tour_tag?: number;
	territory: number;
	country: number;
	location: number;
	tour_type?: number;
	supplements?: Partial<Supplement>[];
	vehicles?: number[];
	station_type?: number;
	stations?: number[];
	accommodations: number[];
	fortnox_cost_center: number;
	is_departed: boolean;
	is_sent_to_fortnox_after_departure: boolean;
	is_active: boolean;
	is_private: boolean;
	is_repeat: boolean;
	repeat_interval?: number;
	repeat_type?: string;
	repeat_for?: number;
	fortnox_project?: number;
	repeat_with_date_intervals?: { departure_date: string }[];
	travel_information: number;
	tour_information: string;
	category: number;
}

// Tags
export interface TourTag {
	id: number;
	code: string;
	is_active: boolean;
}
