import config from '@/config';
import { authService } from '../auth';
import {
	AdditionalCost,
	AdditionalCostResponse,
	AllocateTicketPayload,
	ApplyCouponPayload,
	AssignedTicket,
	Booking,
	BookingCostPayload,
	BookingCostResponse,
	BookingCreatePayload,
	BookingNote,
	BookingNoteParams,
	BookingParams,
	BookingPassengerCreatePayload,
	BookingPassengerCreateResponse,
	BookingPaymentDeadlinePayload,
	BookingSingle,
	BookingTicket,
	BookingUpdatePayload,
	FortnoxLog,
	InvoicePaymentPayload,
	ManualPaymentPayload,
	ManualPaymentResponse,
	PaginateParams,
	Pagination,
	TicketFile,
} from './@types';
import { Common } from './common';
import { HttpAuthService } from './httpService';

class BookingsAPI extends Common {
	constructor(private http: HttpAuthService) {
		super(config.itemsPerPage);
	}

	list(params: BookingParams = {}) {
		const paginateURL = this.setURL('bookings/').params(params).getURL();
		return this.http.get<Pagination<Booking[]>>(paginateURL);
	}

	get(ID: number) {
		return this.http.get<BookingSingle>(`bookings/${ID}/`);
	}

	create(payload: BookingCreatePayload) {
		return this.http.post<Booking>('tour-bookings/', payload);
	}

	update(ID: number, payload: BookingUpdatePayload) {
		return this.http.put<Booking>(`tour-bookings/${ID}/update/`, payload);
	}

	cancel(ID: number) {
		return this.http.put<{ detail: string }>(`bookings/${ID}/cancel/`, {});
	}

	calculateCost(payload: BookingCostPayload, params?: { currency_code?: string }) {
		const costPreviewURL = this.setURL('tour-bookings/cost-preview/')
			.params(params ?? {}, false)
			.getURL();
		console.log(costPreviewURL);
		return this.http.post<BookingCostResponse>(costPreviewURL, payload);
	}

	createPassenger(ID: number, payload: BookingPassengerCreatePayload) {
		return this.http.post<BookingPassengerCreateResponse>(
			`bookings/${ID}/passengers/create/`,
			payload
		);
	}

	updatePassenger(ID: number, passengerID: number, payload: BookingPassengerCreatePayload) {
		return this.http.put<BookingPassengerCreateResponse>(
			`bookings/${ID}/passengers/${passengerID}/`,
			payload
		);
	}

	setPassengerAsPrimary(ID: number, passengerID: number) {
		return this.http.put<{ detail: string }>(
			`bookings/${ID}/passengers/${passengerID}/primary-passenger/`,
			{}
		);
	}

	generatePassengerPassword(passengerID: number) {
		return this.http.post<{ detail: string }>(
			`passengers/${passengerID}/generate-passenger-password/`,
			{}
		);
	}

	setPassengerSerial(ID: number, payload: Record<string, number>[]) {
		return this.http.put<BookingSingle>(`bookings/${ID}/passengers/update-serial/`, payload);
	}

	deletePassenger(ID: number, passengerID: number) {
		return this.http.delete<{ detail: string }>(`bookings/${ID}/passengers/${passengerID}/delete/`);
	}

	updatePaymentDeadline(ID: number, payload: BookingPaymentDeadlinePayload) {
		return this.http.put<Booking>(`bookings/${ID}/booking-payment-date-update/`, payload);
	}

	addManualPayment(ID: number, payload: ManualPaymentPayload) {
		return this.http.post<ManualPaymentResponse>(`bookings/${ID}/add-manual-payment/`, payload);
	}

	addInvoicePayment(ID: number, is_save_and_send: boolean, payload: InvoicePaymentPayload) {
		return this.http.post<ManualPaymentResponse>(
			`bookings/${ID}/create-invoice-payment/?will_send_to_customer=${is_save_and_send}`,
			payload
		);
	}

	addManualRefund(ID: number, payload: ManualPaymentPayload) {
		return this.http.post<ManualPaymentResponse>(`bookings/${ID}/add-refund-payment/`, payload);
	}

	deleteTransaction(ID: number, transactionID: number) {
		return this.http.post<{ detail: string }>(
			`bookings/${ID}/transactions/${transactionID}/delete-payment-transaction/`,
			{}
		);
	}

	downloadInvoice(ID: number, transactionID: number) {
		return this.http.post<Blob>(
			`bookings/${ID}/invoice-download/${transactionID}/`,
			{},
			{
				headers: {
					'content-type': 'application/pdf',
				},
			}
		);
	}

	sendInvoiceToCustomer(ID: number, transactionID: number) {
		return this.http.post<{ detail: string }>(`bookings/${ID}/send-invoice/${transactionID}/`, {});
	}

	printInfo(ID: number) {
		return this.http.post<Blob>(
			`bookings/${ID}/download-booking-info/`,
			{},
			{
				headers: {
					'content-type': 'application/pdf',
				},
			}
		);
	}

	emailInfo(ID: number) {
		return this.http.post<{ detail: string }>(`bookings/${ID}/email-booking-info/`, {});
	}

	transfer(ID: number, TourID: number) {
		return this.http.put<{ detail: string }>(`bookings/${ID}/transfer/${TourID}/`, {});
	}

	getTicketsList(ID: number) {
		return this.http.get<TicketFile[]>(`bookings/${ID}/flight-tickets/`);
	}

	uploadTickets(ID: number, payload: FormData) {
		return this.http.upload<{ detail: string }>(`bookings/${ID}/flight-tickets/upload/`, payload);
	}

	deleteTicket(ID: number, FileID: number | string) {
		return this.http.delete<{ detail: string }>(`bookings/${ID}/flight-tickets/remove/${FileID}/`);
	}

	getAttachmentsList(ID: number) {
		return this.http.get<TicketFile[]>(`bookings/${ID}/attachments/`);
	}

	uploadAttachments(ID: number, payload: FormData) {
		return this.http.upload<{ detail: string }>(`bookings/${ID}/attachments/upload/`, payload);
	}

	deleteAttachment(ID: number, FileID: number | string) {
		return this.http.delete<{ detail: string }>(`bookings/${ID}/attachments/remove/${FileID}/`);
	}

	addCoupon(ID: number, payload: ApplyCouponPayload) {
		return this.http.post<{ detail: string }>(`bookings/${ID}/coupon/`, payload);
	}
	fortnoxLogs(ID: string) {
		return this.http.get<FortnoxLog[]>(`bookings/${ID}/fortnox-logs/`);
	}
	addAdditionalCost(ID: number, is_save_and_send: boolean, payload: AdditionalCost[]) {
		return this.http.post<AdditionalCostResponse>(
			`bookings/${ID}/additional-cost/?will_send_to_customer=${is_save_and_send}`,
			payload
		);
	}
	getAdditionalCostList(ID: number) {
		return this.http.get<AdditionalCost[]>(`bookings/${ID}/additional-cost/`);
	}
	updateAdditionalCost(ID: number, is_save_and_send: boolean, payload: AdditionalCost[]) {
		return this.http.put<AdditionalCostResponse>(
			`bookings/${ID}/additional-cost/?will_send_to_customer=${is_save_and_send}`,
			payload
		);
	}
	sendToFortnox(ID: number) {
		return this.http.post<{ detail: string }>(
			`bookings/${ID}/send-additional-cost-to-fortnox-after-departure/`,
			{}
		);
	}
	tickets(ID: string, params: PaginateParams) {
		const paginateURL = this.setURL(`booking-tickets/`)
			.params({ ...params, booking: ID })
			.getURL();
		return this.http.get<Pagination<BookingTicket[]>>(paginateURL);
	}
	allocateTicket(payload: AllocateTicketPayload) {
		return this.http.post<{ detail: string }>(`booking-tickets/`, payload);
	}
	updateAllocateTicket(ID: number, payload: AllocateTicketPayload) {
		return this.http.put<{ detail: string }>(`booking-tickets/${ID}/`, payload);
	}
	deleteAllocateTicket(ID: number) {
		return this.http.delete<{ detail: string }>(`booking-tickets/${ID}/`);
	}
	assignTicket(payload: { booking_ticket: number; passenger: number }) {
		return this.http.post<{ detail: string }>(`assign-tickets/`, payload);
	}
	assignedTickets(ID: number) {
		return this.http.get<AssignedTicket[]>(`bookings/${ID}/assigned-tickets/`);
	}
	unassignTicket(ID: number) {
		return this.http.delete<{ detail: string }>(`assign-tickets/${ID}/`);
	}
	groupAssignTicket(ID: string, data: { booking_ticket: number }) {
		return this.http.post<{ detail: string }>(`bookings/${ID}/group-assign-tickets/`, data);
	}
	getBookingNotes(params: BookingNoteParams) {
		const paginateURL = this.setURL(`booking-notes/`)
			.params({ ...params })
			.getURL();
		return this.http.get<Pagination<BookingNote[]>>(paginateURL);
	}
	createBookingNote(payload: { booking: number; note: string }) {
		return this.http.post<BookingNote>(`booking-notes/`, payload);
	}
	updateBookingNote(ID: number, payload: { booking: number; note: string }) {
		return this.http.put<BookingNote>(`booking-notes/${ID}/`, payload);
	}
	deleteBookingNote(ID: number) {
		return this.http.delete<{ detail: string }>(`booking-notes/${ID}/`);
	}
}

const httpAuthService = new HttpAuthService(config.apiURL, authService);
export const bookingsAPI = new BookingsAPI(httpAuthService);
