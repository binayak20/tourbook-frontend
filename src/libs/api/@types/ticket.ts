/* eslint-disable @typescript-eslint/no-explicit-any */

import { Station } from './stations';

export interface Ticket {
	id: number;
	ticket_outbound_date: string;
	ticket_inbound_date: string;
	outbound_flight_no: string | null;
	inbound_flight_no: string | null;
	number_of_allocated_tickets: number;
	week_number: number | null;
	outbound_departure_time: string | null;
	inbound_departure_time: string | null;
	outbound_arrival_time: string | null;
	inbound_arrival_time: string | null;
	number_of_tickets: number;
	ticket_type: TicketType;
	departure_station: Station;
	destination_station: Station;
	pnr: string;
	ticket_supplier: TicketSupplier;
	available_tickets: number;
	note: string;
	deadline: string | null;
	reminder_days: number | null;
	reminder_email: string | null;
	reminder_note: string | null;
	is_active: boolean;
}

export interface TicketType {
	id: number;
	name: string;
	slug: string;
	is_active: boolean;
}

export interface TicketSupplier {
	id: number;
	name: string;
	is_active: boolean;
}

export interface TicketSupplierCreate {
	name: string;
}

export interface TicketCreate {
	ticket_outbound_date: string;
	ticket_inbound_date: string;
	ticket_type: number;
	ticket_supplier: number;
	number_of_tickets: number;
	pnr: string;
	departure_station: number;
	destination_station: number;
	deadline: string;
	outbound_flight_no?: string;
	outbound_departure_time?: string;
	outbound_arrival_time?: string;
	inbound_flight_no?: string;
	inbound_departure_time?: string;
	inbound_arrival_time?: string;
	week_number?: number;
}

export interface CreateReminder {
	reminder_days: number;
	reminder_email: string;
	reminder_note: string;
}

export interface TicketSearchParam {
	pnr?: string;
	ticket_outbound_date?: string;
	ticket_inbound_date?: string;
	ticket_supplier?: string;
	ticket_type?: string;
}

export interface Passenger {
	id: number;
	address?: string;
	email?: string;
	first_name: string;
	last_name?: string;
	nationality?: string;
	passport_birth_city?: string;
	passport_expiry_date?: string;
	passport_number?: string;
	telephone_number?: string;
}

export interface TicketBooking {
	ticket: Ticket;
	booking_reference: string;
}
export interface AssignedPassenger {
	id: number;
	passenger: Passenger;
	booking_ticket: TicketBooking;
}
