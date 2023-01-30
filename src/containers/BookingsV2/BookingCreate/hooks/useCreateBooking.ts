import { bookingsAPI } from '@/libs/api';
import { PRIVATE_ROUTES } from '@/routes/paths';
import { message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

export const useCreateBooking = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [payload, setPayload] = useState<API.BookingCreatePayload>({} as API.BookingCreatePayload);

	// Mutate create booking
	const { mutate, isLoading } = useMutation(
		(payload: API.BookingCreatePayload) => bookingsAPI.create(payload),
		{
			onSuccess: () => {
				navigate(`/dashboard/${PRIVATE_ROUTES.BOOKINGS}`);
				message.success(t('Booking created successfully!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return {
		payload,
		setPayload,
		handleCreatebooking: mutate,
		isCreateBookingLoading: isLoading,
	};
};
