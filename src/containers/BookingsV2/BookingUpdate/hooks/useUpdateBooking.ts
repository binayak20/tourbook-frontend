import { bookingsAPI } from '@/libs/api';
import { message } from 'antd';
import { SetStateAction, useCallback } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { TabsType } from '../../BookingCreate/types';

type PassengerPayload = {
	passengerID?: number;
	payload: API.BookingPassengerCreatePayload;
	successCallback: () => void;
	errorCallback: (error: Error) => void;
};

type Args = {
	onChangeActiveTab: (value: SetStateAction<TabsType>) => void;
};

export const useUpdateBooking = ({ onChangeActiveTab }: Args) => {
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();

	// Update booking details
	const { mutate: handleUpdateBooking, isLoading: isBookingUpdating } = useMutation(
		(payload: API.BookingUpdatePayload) => bookingsAPI.update(id, payload),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('booking');
				onChangeActiveTab(TabsType.PASSENGER_DETAILS);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	// Update passenger details
	const { mutate: handleUpdatePassenger, isLoading: isPassengerUpdating } = useMutation(
		({ passengerID, payload }: Required<PassengerPayload>) =>
			bookingsAPI.updatePassenger(id, passengerID, payload),
		{
			onSuccess: (_, { successCallback }) => successCallback(),
			onError: (error: Error, { errorCallback }) => errorCallback(error),
		}
	);

	const { mutate: handleCreatePassenger, isLoading: isPassengerCreating } = useMutation(
		({ payload }: PassengerPayload) => bookingsAPI.createPassenger(id, payload),
		{
			onSuccess: (_, { successCallback }) => successCallback(),
			onError: (error: Error, { errorCallback }) => errorCallback(error),
		}
	);

	const handleCreateOrUpdatePassenger = useCallback(
		(
			payload: Pick<PassengerPayload, 'passengerID' | 'payload'>,
			resolve: (value: unknown) => void
		) => {
			const onSuccess = () => {
				queryClient.invalidateQueries('booking');
				onChangeActiveTab(TabsType.PAYMENTS);
			};

			const onError = (error: Error) => {
				message.error(error.message);
			};

			const passengerPayload: API.BookingPassengerCreatePayload = {
				...payload.payload,
				booking: id,
			};

			if (payload.passengerID) {
				handleUpdatePassenger(
					{
						passengerID: payload.passengerID,
						payload: passengerPayload,
						successCallback: onSuccess,
						errorCallback: onError,
					},
					{ onSettled: resolve }
				);
			} else {
				handleCreatePassenger(
					{
						payload: passengerPayload,
						successCallback: onSuccess,
						errorCallback: onError,
					},
					{ onSettled: resolve }
				);
			}
		},
		[handleCreatePassenger, handleUpdatePassenger, id, onChangeActiveTab, queryClient]
	);

	return {
		handleUpdateBooking,
		isBookingUpdating,
		handleCreateOrUpdatePassenger,
		isPassengerCreatingOrUpdating: isPassengerCreating || isPassengerUpdating,
	};
};
