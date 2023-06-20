import { bookingsAPI } from '@/libs/api';
import moment from 'moment';
import { useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { useBookingContext } from '../../../../components/providers/BookingProvider';
import { PassengerItem, TourBasicsFormValues } from '../../BookingCreate/types';

type Callback = (data: API.BookingSingle) => void;

export const useFormInitialValues = (callback: Callback) => {
	const { id } = useParams() as unknown as { id: number };
	const { setBookingInfo, setDisabled } = useBookingContext();

	const { data } = useQuery('booking', () => bookingsAPI.get(id), {
		onSuccess: (data) => {
			const supplements =
				data?.supplements?.map(({ quantity = 1, ...rest }) => ({
					...rest,
					selectedquantity: quantity,
				})) || [];
			callback({ ...data, supplements });
			setBookingInfo({ ...data, supplements });
		},
	});

	const tourBasicsInitialValues = useMemo(() => {
		const supplements =
			data?.supplements?.map(({ quantity = 1, ...rest }) => ({
				...rest,
				selectedquantity: quantity,
			})) || [];

		return {
			tour: data?.tour?.id,
			tour_details: data?.tour,
			duration: [moment(data?.departure_date), moment(data?.return_date)],
			booking_fee_percent: data?.booking_fee_percent,
			number_of_passenger: data?.number_of_passenger,
			number_of_passenger_took_transfer: data?.number_of_passenger_took_transfer,
			currency: data?.currency?.id,
			station: data?.station?.id || 'no-transfer',
			fortnox_project: data?.fortnox_project?.id,
			supplements,
			coupon_code: data?.coupon_code,
			discount_type: data?.discount_type,
			coupon_or_fixed_discount_amount: data?.coupon_or_fixed_discount_amount,
			discount_note: data?.discount_note,
		} as TourBasicsFormValues;
	}, [data]);

	const passengerDetailsInitialValues = useMemo(() => {
		if (data && Array.isArray(data.passengers) && data.passengers.length > 0) {
			const passengers: PassengerItem[] = [];

			const removeEmpty = (obj: object) => {
				return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
			};

			for (const passenger of data?.passengers || []) {
				const item = removeEmpty(passenger) as PassengerItem;
				item.is_emergency_contact = !!item.emergency_contact_name;

				if (item?.date_of_birth) {
					item.date_of_birth = moment(item.date_of_birth) as unknown as string;
				}

				if (item?.passport_expiry_date) {
					item.passport_expiry_date = moment(item.passport_expiry_date) as unknown as string;
				}

				item.station = item.station ?? 'no-transfer';
				passengers.push(item);
			}

			return { passengers };
		}

		return {
			passengers: [{ passenger_type: "adult", is_primary_passenger: true, allergy: true } as PassengerItem],
		};
	}, [data]);

	const isDisabled = useMemo(() => {
		return ['cancelled', 'transferred'].includes(data?.booking_status || '');
	}, [data]);

	useEffect(() => {
		setDisabled(isDisabled);
	}, [setDisabled, isDisabled]);

	return {
		isDisabled,
		tourBasicsInitialValues,
		passengerDetailsInitialValues,
	};
};
