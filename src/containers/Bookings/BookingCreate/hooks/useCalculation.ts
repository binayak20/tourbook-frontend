import { bookingsAPI } from '@/libs/api';
import { message } from 'antd';
import { useCallback, useState } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';

type SuccessCallback = (data: API.BookingCostResponse) => void;

export const useCalculation = (callback?: SuccessCallback, currecyCode?: string) => {
	const { id } = useParams() as unknown as { id: number };
	const [calculation, setCalculation] = useState<API.BookingCostResponse>(
		{} as API.BookingCostResponse
	);

	const { mutate: mutateCalculateTotal, isLoading } = useMutation(
		(payload: API.BookingCostPayload) =>
			bookingsAPI.calculateCost(payload, { currency_code: currecyCode }),
		{
			onSuccess: (data) => {
				callback?.(data);
				setCalculation(data);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleCalculateTotal = useCallback(
		(payload: API.BookingCostPayload) => {
			const isAllowCalculation =
				payload?.tour &&
				payload?.currency &&
				payload?.number_of_passenger > 0 &&
				(payload?.number_of_passenger_took_transfer === 0 ||
					payload?.number_of_passenger_took_transfer > 0);

			if (isAllowCalculation) {
				mutateCalculateTotal({ ...payload, booking: id });
			} else {
				setCalculation({} as API.BookingCostResponse);
			}
		},
		[mutateCalculateTotal, id]
	);

	return {
		calculation,
		handleCalculateTotal,
		isLoading,
	};
};
