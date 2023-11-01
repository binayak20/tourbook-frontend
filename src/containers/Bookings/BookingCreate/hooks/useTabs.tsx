import moment from 'moment';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { PassengerDetails } from '../PassengerDetails';
import { Payments } from '../Payments';
import { TourBasics } from '../TourBasics';
import { PassengerItem, Tab, TabsType } from '../types';
import { useCalculation } from './useCalculation';
import { useCreateBooking } from './useCreateBooking';

export const useTabs = () => {
	const { t } = useTranslation();
	const location = useLocation();
	const tourDetails = location?.state?.tourDetails;
	const [activeKey, setActiveKey] = useState<TabsType>(TabsType.TOUR_BASICS);
	const [enabledKeys, setEnabledKeys] = useState<TabsType[]>([TabsType.TOUR_BASICS]);
	const { payload, setPayload, handleCreatebooking, isCreateBookingLoading } = useCreateBooking();
	const { calculation, handleCalculateTotal, isLoading: calculationLoading } = useCalculation();

	const intialValues = useMemo(
		() => ({
			number_of_passenger_took_transfer: 0,
			tour: location?.state?.tourID,
			supplements: tourDetails?.supplements?.map((supple: API.Supplement) => ({
				...supple,
				selectedquantity: 1,
			})),
			tour_details: tourDetails,
			duration: tourDetails
				? [moment(tourDetails?.departure_date), moment(tourDetails?.return_date)]
				: undefined,
			fortnox_project: tourDetails?.fortnox_project?.id,
			booking_fee_percent: tourDetails?.booking_fee_percent,
			second_payment_percent: tourDetails?.second_payment_percent,
		}),
		[tourDetails, location?.state]
	);
	const handleBackClick = useCallback(() => {
		switch (activeKey) {
			case TabsType.PASSENGER_DETAILS:
				setActiveKey(TabsType.TOUR_BASICS);
				break;

			case TabsType.PAYMENTS:
				setActiveKey(TabsType.PASSENGER_DETAILS);
				break;

			default:
				break;
		}
	}, [activeKey]);

	const handleFormSubmit = useCallback(
		(formPayload?: Partial<API.BookingCreatePayload>) => {
			switch (activeKey) {
				case TabsType.TOUR_BASICS:
					setPayload((prev) => ({ ...prev, ...formPayload }));
					setActiveKey(TabsType.PASSENGER_DETAILS);
					setEnabledKeys((prev) => [...prev, TabsType.PASSENGER_DETAILS]);
					break;

				case TabsType.PASSENGER_DETAILS:
					setPayload((prev) => ({ ...prev, ...formPayload }));
					setActiveKey(TabsType.PAYMENTS);
					setEnabledKeys((prev) => [...prev, TabsType.PAYMENTS]);
					break;

				case TabsType.PAYMENTS:
					delete payload?.vehicles;
					handleCreatebooking({ ...payload, ...formPayload });
					setPayload({} as API.BookingCreatePayload);
					break;

				default:
					break;
			}
		},
		[activeKey, handleCreatebooking, payload, setPayload]
	);

	const passengerRehydration = useMemo(() => {
		return payload.passengers?.map(
			(passenger) =>
				({
					...passenger,
					date_of_birth: moment(passenger?.date_of_birth) as unknown as string,
					passport_expiry_date: moment(passenger?.passport_expiry_date) as unknown as string,
					pickup_location: passenger?.pickup_location,
				} as PassengerItem)
		);
	}, [payload]);

	const calculateWithDiscount = useCallback(
		(values: Partial<API.BookingCostPayload>) =>
			handleCalculateTotal({
				currency: payload?.currency,
				number_of_passenger: payload?.number_of_passenger,
				number_of_passenger_took_transfer: payload?.number_of_passenger_took_transfer,
				tour: payload?.tour,
				supplements: payload?.supplements,
				...values,
			}),
		[payload, handleCalculateTotal]
	);

	const items = useMemo(() => {
		return [
			{
				key: TabsType.TOUR_BASICS,
				label: t('Tour Basics'),
				children: (
					<TourBasics
						initialValues={intialValues}
						totalPrice={calculation?.sub_total || 0}
						onCalculate={handleCalculateTotal}
						onFinish={handleFormSubmit}
					/>
				),
				disabled: !enabledKeys.includes(TabsType.TOUR_BASICS) || isCreateBookingLoading,
			},
			{
				key: TabsType.PASSENGER_DETAILS,
				label: t('Passenger Details'),
				children: (
					<PassengerDetails
						initialValues={{
							passengers: passengerRehydration
								? passengerRehydration
								: [
										{
											passenger_type: 'adult',
											allergy: true,
											is_primary_passenger: true,
										} as PassengerItem,
								  ],
						}}
						tour={payload?.tour}
						totalPassengerTransfers={payload?.number_of_passenger_took_transfer}
						backBtnProps={{ onClick: handleBackClick }}
						totalPassengers={payload?.number_of_passenger || 0}
						onFinish={handleFormSubmit}
						vehicles={payload?.vehicles}
					/>
				),
				disabled: !enabledKeys.includes(TabsType.PASSENGER_DETAILS) || isCreateBookingLoading,
			},
			{
				key: TabsType.PAYMENTS,
				label: t('Payments'),
				children: (
					<Payments
						{...{
							currency: calculation?.currency,
							cost_preview_rows: calculation?.cost_preview_rows || [],
							sub_total: calculation?.sub_total || 0,
							backBtnProps: {
								onClick: handleBackClick,
								disabled: isCreateBookingLoading,
							},
							finishBtnProps: {
								loading: isCreateBookingLoading,
							},
							onFinish: handleFormSubmit,
							calculateWithDiscount,
							calculationLoading,
							tour: payload?.tour,
						}}
					/>
				),
				disabled: !enabledKeys.includes(TabsType.PAYMENTS) || isCreateBookingLoading,
			},
		] as Tab[];
	}, [
		t,
		enabledKeys,
		handleCalculateTotal,
		handleFormSubmit,
		handleBackClick,
		isCreateBookingLoading,
		calculation?.cost_preview_rows,
		calculation?.sub_total,
		payload?.number_of_passenger,
		payload?.number_of_passenger_took_transfer,
		payload?.tour,
		passengerRehydration,
		calculation?.currency,
		intialValues,
		calculateWithDiscount,
		calculationLoading,
		payload?.vehicles,
	]);

	const handleActiveKeyChange = (key: string) => {
		setActiveKey(key as TabsType);
	};

	return {
		activeKey,
		handleActiveKeyChange,
		items,
	};
};
