import { bookingsAPI } from '@/libs/api';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';

export const usePassenger = () => {
	const { t } = useTranslation();
	const { id } = useParams() as unknown as { id: number };
	const queryClient = useQueryClient();

	const { mutate: mutateGeneratePassword, isLoading: isGeneratePasswordLoading } = useMutation(
		(passengerID: number) => bookingsAPI.generatePassengerPassword(passengerID),
		{
			onSuccess: (data) => {
				message.success(data.detail);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: mutatePrimaryPassenger, isLoading: isPrimaryPassengerLoading } = useMutation(
		(passengerID: number) => bookingsAPI.setPassengerAsPrimary(id, passengerID),
		{
			onSuccess: (data) => {
				message.success(data.detail);
				queryClient.invalidateQueries(['booking']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: mutateRemovePassenger, isLoading: isRemovePassengerLoading } = useMutation(
		(passengerID: number) => bookingsAPI.deletePassenger(id, passengerID),
		{
			onSuccess: (data) => {
				message.success(data.detail);
				queryClient.invalidateQueries(['booking']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const { mutate: mutateMovePassenger } = useMutation(
		(payload: Record<string, number>[]) => bookingsAPI.setPassengerSerial(id, payload),
		{
			onSuccess: () => {
				message.success(t('Passenger moved successfully!'));
				queryClient.invalidateQueries(['booking']);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	return {
		mutateGeneratePassword,
		mutatePrimaryPassenger,
		mutateRemovePassenger,
		mutateMovePassenger,
		isGeneratePasswordLoading,
		isPrimaryPassengerLoading,
		isRemovePassengerLoading,
	};
};
