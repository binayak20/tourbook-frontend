/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaginateParams } from './common';
import { FortnoxProject } from './fortnox';
import { Ticket } from './ticket';

// Get bookings list
export interface BookingParams extends PaginateParams {
	booking_name?: string;
	is_active?: boolean;
	reference?: string;
	booking_type?: string;
	departure_date?: string;
	is_departed?: string;
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
	stations?: number[];
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

// Create a booking
interface Passenger {
	id?: number;
	first_name: string;
	last_name: string;
	email?: string;
	name_title: string;
	gender: string;
	date_of_birth: string;
	personal_identity_number?: string;
	passport_number?: string;
	passport_expiry_date?: string;
	passport_birth_city?: string;
	nationality?: string;
	telephone_number?: string;
	passenger_type: 'adult' | 'child' | 'infant';
	allergy: boolean;
	allergy_description?: string;
	additional_info?: string;
	is_primary_passenger: boolean;
	emergency_contact_name?: string;
	emergency_contact_telephone_number?: string;
	emergency_contact_email?: string;
	emergency_contact_relation?: string;
	pickup_location?: number;
	address?: string;
	city: string;
	post_code?: string;
}

interface Supplement {
	supplement: number;
	quantity: number;
}

export interface BookingCreatePayload {
	tour: number;
	currency: number;
	number_of_passenger: number;
	number_of_passenger_took_transfer: number;
	is_passenger_took_transfer: boolean;
	station_type?: any;
	station?: any;
	booking_fee_percent: number;
	discount_type?: 'amount' | 'coupon';
	discount_note?: string;
	passengers: Passenger[];
	supplements?: Supplement[];
	fortnox_project?: number;
	coupon_code?: string;
	coupon_or_fixed_discount_amount?: number;
	second_payment_percent: number;
}

export interface BookingCostPayload {
	tour: number;
	currency: number;
	number_of_passenger: number;
	number_of_passenger_took_transfer: number;
	supplements?: Supplement[];
	booking?: number;
	coupon_code?: string;
	discount_type?: 'amount' | 'coupon';
	coupon_or_fixed_discount_amount?: number;
}

export interface CostPreviewRow {
	name: string;
	quantity: number;
	unit_price: number;
	total_price: number;
}

export interface CostPreviewCurrency {
	country_name: string;
	currency_code: string;
	id: number;
	name: string;
}

export interface BookingCostResponse {
	cost_preview_rows: CostPreviewRow[];
	currency: CostPreviewCurrency;
	due: number;
	paid_percentage: number;
	sub_total: number;
}

export type BookingUpdatePayload = Omit<BookingCreatePayload, 'passengers'>;

export interface BookingPassengerCreatePayload
	extends Omit<Passenger, 'serial_id' | 'is_primary_passenger' | 'passport_expiry_date'> {
	user?: any;
	booking: number;
	passport_expiry_date?: string | null;
}

export interface BookingPassengerCreateResponse extends Passenger {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	user?: any;
	booking: number;
}

export interface BookingPaymentDeadlinePayload {
	first_payment_deadline: string;
	residue_payment_deadline: string;
}

export interface ManualPaymentPayload {
	amount: number;
	date: string;
}

export interface ManualPaymentSummary {
	total_payable: number;
	paid_percentage: number;
	due: number;
	total_paid: number;
}

export interface ManualPaymentResponse {
	detail: string;
	payment_summary: ManualPaymentSummary;
}

export interface InvoicePaymentPayload {
	first_name?: string;
	last_name?: string;
	amount: number;
	expiry_date: string;
	email?: string;
	customer_type?: string;
	payment_address: {
		address: string;
		post_code: string;
		city?: string;
		country?: string;
	};
	organisation_number?: string;
	country?: number;
}

export interface BookingTicketPassenger {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	first_name: string;
	last_name: string;
	email: string;
	address?: any;
	serial_id: number;
	is_primary_passenger: boolean;
	name_title?: any;
	gender?: any;
	date_of_birth: string;
	personal_identity_number?: any;
	passport_number: string;
	passport_expiry_date?: any;
	passport_birth_city?: any;
	nationality?: any;
	telephone_number: string;
	is_adult: boolean;
	allergy: boolean;
	allergy_description?: any;
	additional_info?: any;
	emergency_contact_name?: any;
	emergency_contact_telephone_number?: any;
	emergency_contact_email?: any;
	emergency_contact_relation?: any;
	user: number;
	booking: number;
}

export interface TicketFile {
	id: number;
	booking: number;
	booking_passenger: BookingTicketPassenger;
	booking_file: string;
	file_name: string;
	file_category: string;
	is_active: boolean;
}

export interface ApplyCouponPayload {
	coupon_code?: string;
	discount_type?: 'amount' | 'coupon';
	coupon_or_fixed_discount_amount?: number;
	discount_note?: string;
	is_applied: boolean;
}

export interface FortnoxLog {
	id: number;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	voucher_series?: any;
	request_body: any;
	request_url: string;
	response: string;
	response_status_code: string;
	voucher_number?: any;
	description?: any;
	is_success: boolean;
	booking?: any;
	fortnox_event?: any;
	transaction?: any;
	fortnox_cost_center?: string;
	fortnox_project?: string;
}

export interface BookingTour {
	id: number;
	reference: string;
	booking_name: string;
	booking_type: string;
	tour: Tour;
	number_of_passenger: number;
	departure_date: string;
	grand_total: number;
	passengers: Passenger[];
	primary_passenger: Passenger;
	paid_percentage: number;
	created_at: string;
	currency: Currency;
	fortnox_project: FortnoxProject;
}

export interface BookingPassenger {
	id: number;
	booking_reference: string;
	passenger_name: string;
	date_of_birth: any;
	passport_number: any;
	email: string;
	telephone: any;
	allergy_description: any;
	pickup_location: any;
	booking_date: string;
	departure_date: string;
	currency: string;
	booking_status: string;
	is_departed: boolean;
}

export interface AdditionalCost {
	name: string;
	amount: number;
	id?: number;
	is_sent_to_fortnox?: boolean;
}

export interface AdditionalCostResponse {
	detail: string;
}

export interface BookingTicket {
	id: number;
	number_of_tickets: number;
	number_of_assigned_tickets: number;
	ticket: Ticket;
}

export interface AllocateTicketPayload {
	ticket: number;
	booking: number;
	number_of_tickets: number;
}

export interface AssignedTicket {
	id: number;
	booking_ticket: Omit<BookingTicket, 'quantity' | 'remaining_quantity'>;
	passenger: BookingPassenger;
}

export interface CreatedBy {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	is_active: boolean;
}
export interface BookingNote {
	id: number;
	created_by: CreatedBy;
	is_active: boolean;
	created_at: string;
	updated_at: string;
	note: string;
	updated_by: number;
	booking: number;
}

export interface BookingNoteParams extends PaginateParams {
	booking?: number;
}
