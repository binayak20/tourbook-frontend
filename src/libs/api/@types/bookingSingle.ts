/* eslint-disable @typescript-eslint/no-explicit-any */
interface Passenger {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	first_name: string;
	last_name: string;
	email: string;
	serial_id: number;
	is_primary_passenger: boolean;
	name_title: string;
	gender: string;
	date_of_birth: string;
	nationality?: string;
	personal_identity_number?: string;
	passport_number: string;
	telephone_number?: string;
	is_adult: boolean;
	allergy: boolean;
	allergy_description?: string;
	additional_info?: string;
	user?: number;
	booking: number;
}

interface Tour {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	name: string;
	description: string;
	duration: number;
	capacity: number;
	remaining_capacity: number;
	number_of_booking_passenger: number;
	departure_date: string;
	return_date: string;
	is_reserved: boolean;
	reservation_expiry_date: string;
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
	station_type: number;
	fortnox_cost_center: number;
	tour_tag?: any;
	supplements: number[];
	vehicles: number[];
	stations: number[];
	accommodations: number[];
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

export interface BookingSingle {
	id: number;
	passengers: Passenger[];
	supplements: any[];
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	reference: string;
	booking_name?: any;
	booking_type: string;
	number_of_passenger: number;
	departure_date: string;
	return_date: string;
	is_passenger_took_transfer: boolean;
	standard_price: number;
	tour_price: number;
	transfer_price: number;
	total_transfer_price: number;
	additional_transfer_price: number;
	total_additional_transfer_price: number;
	supplement_price: number;
	booking_fee_percent: number;
	booking_fee: number;
	cancellation_fee_fee_percent: number;
	cancellation_fee: number;
	travel_insurance: number;
	sub_total: number;
	discount: number;
	grand_total: number;
	total_payment: number;
	due: number;
	first_payment_deadline?: any;
	residue_payment_deadline?: any;
	currency_code: string;
	coupon_code?: any;
	discount_type?: any;
	discount_percentage: number;
	discount_note?: any;
	additional_info?: any;
	is_paid: boolean;
	is_booking_fee_paid: boolean;
	is_booking_transferred: boolean;
	is_terms_and_condition_accepted: boolean;
	is_departed: boolean;
	is_sent_to_fortnox_after_departure: boolean;
	booking_status: string;
	canceled_at?: any;
	transferred_at?: any;
	tour: Tour;
	currency: Currency;
	station_type?: any;
	station?: any;
	transferred_booking?: any;
	accommodations: any[];
	vehicles: any[];
}
