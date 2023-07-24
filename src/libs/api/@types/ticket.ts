/* eslint-disable @typescript-eslint/no-explicit-any */

import { Station } from './stations';

export interface Ticket {
	id: number;
	start_date: string;
	end_date: string;
	outbound_flight_no: string | null;
	inbound_flight_no: string | null;
	assigned_tickets: number;
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
	start_date: string;
	end_date: string;
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
