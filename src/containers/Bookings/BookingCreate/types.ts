import { Tour, Vehicle } from '@/libs/api/@types';
import { ButtonProps, TabPaneProps } from 'antd';
import dayjs from 'dayjs';

export enum TabsType {
	TOUR_BASICS = 'tour-basics',
	PASSENGER_DETAILS = 'passenger-details',
	PAYMENTS = 'payments',
}

export type Tab = Omit<TabPaneProps, 'tab'> & {
	key: TabsType;
	label: React.ReactNode;
};

export type TourBasicsFormValues = {
	tour: number;
	tour_details?: Tour;
	duration?: dayjs.Dayjs[];
	currency: number;
	number_of_passenger: number;
	number_of_passenger_took_transfer: number;
	user_type?: string;
	booking_fee_percent: number;
	station?: string;
	fortnox_project?: number;
	supplements?: (API.Supplement & { selectedquantity: number })[];
	coupon_code?: string;
	discount_type?: 'amount' | 'coupon';
	coupon_or_fixed_discount_amount?: number;
	discount_note?: string;
	is_departed?: boolean;
	second_payment_percent?: number;
};

export type TourBasicsProps = {
	initialValues?: Partial<TourBasicsFormValues>;
	totalPrice: number;
	onCalculate: (values: API.BookingCostPayload) => void;
	disabled?: boolean;
	onFinish: (values: Partial<API.BookingCreatePayload>) => void;
	loading?: boolean;
	isUpdate?: boolean;
	setSelectedCurrencyCode?: (currencyCode?: string) => void;
};

export type PassengerItem = API.BookingCreatePayload['passengers'][number] & {
	is_emergency_contact?: boolean;
	transportation?: boolean;
};

export type PassengerDetailsProps = {
	initialValues: {
		passengers: PassengerItem[];
	};
	totalPassengers: number;
	backBtnProps: ButtonProps;
	disabled?: boolean;
	onFinish: (values: Partial<API.BookingCreatePayload>) => void;
	loading?: boolean;
	totalPassengerTransfers: number;
	tour: number;
	vehicles?: Vehicle[];
};

export type PaymentsProps = Pick<
	API.BookingCostResponse,
	'cost_preview_rows' | 'sub_total' | 'currency'
> & {
	backBtnProps: ButtonProps;
	finishBtnProps: ButtonProps & { isVisible?: boolean };
	onFinish?: (values: Partial<API.BookingCreatePayload>) => void;
	calculateWithDiscount?: (values: Partial<API.BookingCostPayload>) => void;
	calculationLoading?: boolean;
	initialDiscount?: Partial<API.BookingCreatePayload>;
	tour: number;
	isDeparted?: boolean;
};
