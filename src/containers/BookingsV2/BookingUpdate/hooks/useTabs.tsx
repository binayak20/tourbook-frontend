import { useBookingContext } from '@/components/providers/BookingProvider';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCalculation } from '../../BookingCreate/hooks/useCalculation';
import { useCreateBooking } from '../../BookingCreate/hooks/useCreateBooking';
import { PassengerDetails } from '../../BookingCreate/PassengerDetails';
import { Payments } from '../../BookingCreate/Payments';
import { TourBasics } from '../../BookingCreate/TourBasics';
import { Tab, TabsType } from '../../BookingCreate/types';
import { useFormInitialValues } from './useFormInitialValues';

export const useTabs = (callback: (value: boolean) => void) => {
	const { t } = useTranslation();
	const [activeKey, setActiveKey] = useState<TabsType>(TabsType.TOUR_BASICS);
	const [enabledKeys, setEnabledKeys] = useState<TabsType[]>([TabsType.TOUR_BASICS]);
	const { setCalculatedPrice } = useBookingContext();
	const { payload, setPayload, handleCreatebooking, isCreateBookingLoading } = useCreateBooking();
	const { calculation, handleCalculateTotal } = useCalculation(setCalculatedPrice);

	const { isDisabled, tourBasicsInitialValues, passengerDetailsInitialValues } =
		useFormInitialValues((data) => {
			const supplementsArr =
				data?.supplements?.map(({ id, selectedquantity }) => ({
					supplement: id,
					quantity: selectedquantity || 1,
				})) || [];

			const calcPayload: API.BookingCostPayload = {
				tour: data.tour?.id,
				currency: data.currency?.id,
				number_of_passenger: data.number_of_passenger,
				number_of_passenger_took_transfer: data?.number_of_passenger_took_transfer,
				is_passenger_took_transfer: data?.station?.id ? true : false,
				supplements: supplementsArr,
			};
			handleCalculateTotal(calcPayload);
			setEnabledKeys((prev) => [...prev, TabsType.PASSENGER_DETAILS, TabsType.PAYMENTS]);
			callback(false);
		});

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
					handleCreatebooking(payload);
					setPayload({} as API.BookingCreatePayload);
					break;

				default:
					break;
			}
		},
		[activeKey, handleCreatebooking, payload, setPayload]
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
					/>
				),
				disabled: !enabledKeys.includes(TabsType.TOUR_BASICS) || isCreateBookingLoading,
			},
			{
				key: TabsType.PASSENGER_DETAILS,
				label: t('Passenger Details'),
				children: (
					<PassengerDetails
						initialValues={passengerDetailsInitialValues}
						backBtnProps={{ onClick: handleBackClick }}
						totalPassengers={payload?.number_of_passenger || 0}
						disabled={isDisabled}
						onFinish={handleFormSubmit}
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
							cost_preview_rows: calculation?.cost_preview_rows || [],
							sub_total: calculation?.sub_total || 0,
							backBtnProps: {
								onClick: handleBackClick,
								disabled: isCreateBookingLoading,
							},
							finishBtnProps: {
								isVisible: false,
								loading: isCreateBookingLoading,
								onClick: () => handleFormSubmit(),
							},
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
		isDisabled,
		tourBasicsInitialValues,
		passengerDetailsInitialValues,
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
