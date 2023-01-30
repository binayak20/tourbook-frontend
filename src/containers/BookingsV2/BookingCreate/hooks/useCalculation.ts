import { bookingsAPI } from '@/libs/api';
import { message } from 'antd';
import { useCallback } from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';

export const useCalculation = () => {
	const { id } = useParams() as unknown as { id: number };

	const { mutate: mutateCalculateTotal, data: calculation } = useMutation(
		(payload: API.BookingCostPayload) => bookingsAPI.calculateCost(payload),
		{
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const handleCalculateTotal = useCallback(
		(payload: API.BookingCostPayload) => {
			if (payload?.tour && payload?.currency && payload?.number_of_passenger > 0) {
				mutateCalculateTotal({ ...payload, booking: id });
			}
		},
		[mutateCalculateTotal, id]
	);

	return {
		calculation,
		handleCalculateTotal,
	};
};
