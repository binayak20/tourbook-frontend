/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateParams } from './common';

export interface BookingParams extends PaginateParams {
	booking_name?: string;
	is_active?: boolean;
	booking_reference?: string;
	booking_type?: string;
	departure_date?: string;
}

interface Tour {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	description?: any;
	duration: number;
	capacity: number;
	remaining_capacity: number;
	number_of_booking_passengers: number;
	departure_date: string;
	return_date: string;
	is_reserved: boolean;
	reservation_expiry_date?: any;
	reserved_capacity: number;
	standard_price: number;
	transfer_price: number;
	cancel_fee_percent: number;
	cancel_fee: number;
	travel_insurance_percent: number;
	booking_fee_percent: number;
	booking_fee: number;
	is_departed: boolean;
	is_sent_to_fortnox_after_departure: boolean;
	is_private: boolean;
	created_by?: any;
	updated_by?: any;
	currency: number;
	territory: number;
	country: number;
	location: number;
	tour_type: number;
	station_type?: any;
	fortnox_cost_center: number;
	tour_tag?: any;
	supplements: any[];
	vehicles: any[];
	stations: any[];
	accommodations: any[];
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

export interface Booking {
	id: number;
	reference: string;
	booking_name?: any;
	booking_type: string;
	tour: Tour;
	number_of_passenger: number;
	departure_date?: any;
	grand_total: number;
	paid_percentage: number;
	created_at: Date;
	currency: Currency;
}
