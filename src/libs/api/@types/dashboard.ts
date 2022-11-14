/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LastThirtyDaysTransaction {
	day: number;
	amount: number;
}

export interface BookingsSummaryByMonthsRange {
	booking_count: number;
	booking_month_year: string;
}

export interface TodayBookingsSummary {
	count: number;
	percentage_change: number;
	title: string;
	type: string;
	time: string;
	currency?: any;
}

export interface TodayDepartedToursSummary {
	count: number;
	percentage_change: number;
	title: string;
	type: string;
	time: string;
	currency?: any;
}

export interface ThisMonthTransactionsSummary {
	total_amount: number;
	percentage_change: number;
	title: string;
	type: string;
	time: string;
	currency: string;
}

export interface DashboardSummaryReport {
	last_thirty_days_transactions: LastThirtyDaysTransaction[];
	last_thirty_days_transactions_sum: number;
	bookings_summary_by_months_range: BookingsSummaryByMonthsRange[];
	today_bookings_summary: TodayBookingsSummary;
	today_departed_tours_summary: TodayDepartedToursSummary;
	this_month_transactions_summary: ThisMonthTransactionsSummary;
}
