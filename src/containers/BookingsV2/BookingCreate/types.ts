import { ButtonProps, TabPaneProps } from 'antd';

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
	duration?: moment.Moment[];
	currency: number;
	number_of_passenger: number;
	user_type?: string;
	booking_fee_percent: number;
	station?: string;
	fortnox_project?: number;
};

export type TourBasicsProps = {
	initialValues?: TourBasicsFormValues;
	totalPrice: number;
	onCalculate: (values: API.BookingCostPayload) => void;
	disabled?: boolean;
	onFinish: (values: Partial<API.BookingCreatePayload>) => void;
};

export type PassengerItem = API.BookingCreatePayload['passengers'][number] & {
	is_emergency_contact?: boolean;
};

export type PassengerDetailsProps = {
	initialValues: {
		passengers: PassengerItem[];
	};
	totalPassengers: number;
	backBtnProps: ButtonProps;
	disabled?: boolean;
	onFinish: (values: Partial<API.BookingCreatePayload>) => void;
};

export type PaymentsProps = Pick<API.BookingCostResponse, 'cost_preview_rows' | 'sub_total'> & {
	backBtnProps: ButtonProps;
	finishBtnProps: ButtonProps & { isVisible?: boolean };
};
