import { useBookingContext } from '@/components/providers/BookingProvider';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PassengerDetails } from '../../BookingCreate/PassengerDetails';
import { Payments } from '../../BookingCreate/Payments';
import { TourBasics } from '../../BookingCreate/TourBasics';
import { useCalculation } from '../../BookingCreate/hooks/useCalculation';
import { Tab, TabsType } from '../../BookingCreate/types';
import { useFormInitialValues } from './useFormInitialValues';
import { useUpdateBooking } from './useUpdateBooking';

export const useTabs = (callback: (value: boolean) => void) => {
	const { t } = useTranslation();
	const [activeKey, setActiveKey] = useState<TabsType>(TabsType.TOUR_BASICS);
	const [enabledKeys, setEnabledKeys] = useState<TabsType[]>([TabsType.TOUR_BASICS]);
	const { setCalculatedPrice } = useBookingContext();
	const { calculation, handleCalculateTotal } = useCalculation(setCalculatedPrice);
	const {
		handleUpdateBooking,
		handleCreateOrUpdatePassenger,
		isPassengerCreatingOrUpdating,
		isBookingUpdating,
	} = useUpdateBooking({
		onChangeActiveTab: setActiveKey,
	});

	// Get initial values for Tour Basics and Passenger Details
	const { isDisabled, tourBasicsInitialValues, passengerDetailsInitialValues } =
		useFormInitialValues((data) => {
			const supplementsArr =
				data?.supplements?.map(({ id, selectedquantity = 1, price }) => ({
					supplement: id,
					quantity: selectedquantity,
					price,
				})) || [];

			const calcPayload: API.BookingCostPayload = {
				tour: data.tour?.id,
				currency: data.currency?.id,
				number_of_passenger: data.number_of_passenger,
				number_of_passenger_took_transfer: data?.number_of_passenger_took_transfer,
				supplements: supplementsArr,
				coupon_code: data?.coupon_code,
				discount_type: data?.discount_type,
				coupon_or_fixed_discount_amount: data?.coupon_or_fixed_discount_amount,
			};
			handleCalculateTotal(calcPayload);
			setEnabledKeys((prev) => [...prev, TabsType.PASSENGER_DETAILS, TabsType.PAYMENTS]);
			callback(false);
		});

	// Handle back to previous tab
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

	// Handle form submit for each tab
	const handleFormSubmit = useCallback(
		async (formPayload?: Partial<API.BookingCreatePayload>) => {
			switch (activeKey) {
				case TabsType.TOUR_BASICS:
					handleUpdateBooking(formPayload as API.BookingUpdatePayload);
					break;

				case TabsType.PASSENGER_DETAILS:
					// eslint-disable-next-line no-case-declarations
					const { passengers } = formPayload as unknown as {
						passengers: API.BookingPassengerCreatePayload[];
					};

					for (const passenger of passengers) {
						await new Promise((resolve) => {
							handleCreateOrUpdatePassenger(
								{
									passengerID: passenger?.id,
									payload: passenger,
								},
								resolve
							);
						});
					}
					break;

				case TabsType.PAYMENTS:
					break;

				default:
					break;
			}
		},
		[activeKey, handleUpdateBooking, handleCreateOrUpdatePassenger]
	);

	const items = useMemo(() => {
		return [
			{
				key: TabsType.TOUR_BASICS,
				label: t('Tour Basics'),
				children: (
					<TourBasics
						initialValues={tourBasicsInitialValues}
						totalPrice={calculation?.sub_total || 0}
						onCalculate={handleCalculateTotal}
						disabled={isDisabled}
						onFinish={handleFormSubmit}
						loading={isBookingUpdating}
						isUpdate={true}
					/>
				),
				disabled: !enabledKeys.includes(TabsType.TOUR_BASICS),
			},
			{
				key: TabsType.PASSENGER_DETAILS,
				label: t('Passenger Details'),
				children: (
					<PassengerDetails
						initialValues={passengerDetailsInitialValues}
						backBtnProps={{ onClick: handleBackClick }}
						totalPassengers={tourBasicsInitialValues?.number_of_passenger || 0}
						totalPassengerTransfers={
							tourBasicsInitialValues?.number_of_passenger_took_transfer || 0
						}
						tour={tourBasicsInitialValues?.tour}
						disabled={isDisabled}
						onFinish={handleFormSubmit}
						loading={isPassengerCreatingOrUpdating}
					/>
				),
				disabled: !enabledKeys.includes(TabsType.PASSENGER_DETAILS),
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
							},
							finishBtnProps: {
								isVisible: false,
								onClick: () => handleFormSubmit(),
							},
							initialDiscount: {
								coupon_or_fixed_discount_amount:
									tourBasicsInitialValues?.coupon_or_fixed_discount_amount,
								discount_type: tourBasicsInitialValues?.discount_type,
								discount_note: tourBasicsInitialValues?.discount_note,
								coupon_code: tourBasicsInitialValues?.coupon_code,
							},
						}}
					/>
				),
				disabled: !enabledKeys.includes(TabsType.PAYMENTS),
			},
		] as Tab[];
	}, [
		calculation?.cost_preview_rows,
		calculation?.sub_total,
		enabledKeys,
		handleBackClick,
		handleCalculateTotal,
		handleFormSubmit,
		isBookingUpdating,
		isPassengerCreatingOrUpdating,
		isDisabled,
		passengerDetailsInitialValues,
		t,
		tourBasicsInitialValues,
		calculation?.currency,
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
