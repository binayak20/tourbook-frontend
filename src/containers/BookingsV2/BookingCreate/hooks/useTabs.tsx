import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PassengerDetails } from '../PassengerDetails';
import { Payments } from '../Payments';
import { TourBasics } from '../TourBasics';
import { PassengerItem, Tab, TabsType } from '../types';
import { useCalculation } from './useCalculation';
import { useCreateBooking } from './useCreateBooking';

export const useTabs = () => {
	const { t } = useTranslation();
	const [activeKey, setActiveKey] = useState<TabsType>(TabsType.TOUR_BASICS);
	const [enabledKeys, setEnabledKeys] = useState<TabsType[]>([TabsType.TOUR_BASICS]);
	const { payload, setPayload, handleCreatebooking, isCreateBookingLoading } = useCreateBooking();
	const { calculation, handleCalculateTotal } = useCalculation();

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
							passengers: [{ is_adult: true, is_primary_passenger: true } as PassengerItem],
						}}
						backBtnProps={{ onClick: handleBackClick }}
						totalPassengers={payload?.number_of_passenger || 0}
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
