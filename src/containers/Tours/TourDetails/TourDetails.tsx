import { toursAPI } from '@/libs/api';
import { Card, Col, Row, message } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import { FormSkeleton } from '../FormSkeleton';
import DiscountList from './DiscountList';
import { TourDiscountForm } from './TourDiscountForm';

type TourDetailsProps = {
	mode?: 'create' | 'update';
};

export const TourDetails: FC<TourDetailsProps> = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const { id } = useParams() as unknown as { id: number };
	const { data, isLoading } = useQuery(
		['tour-discount-history', id],
		() => toursAPI.tourDiscountHistory(id),
		{
			enabled: true,
		}
	);
	const { mutate: deletePickupLoaction, isLoading: isDeleteLoading } = useMutation(
		(id: number) => toursAPI.tourDiscountDelete(id),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('settings-pickup-locations');
				message.success(t('Pickup location has been deleted!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const deleteThisPickupLocation = () => {
		deletePickupLoaction(id);
	};
	return (
		<Card>
			<Row gutter={32}>
				<Col span={12}>
					{isLoading ? (
						<FormSkeleton />
					) : (
						<TourDiscountForm
							data={data}
							handleDelete={deleteThisPickupLocation}
							isDeleteLoading={isDeleteLoading}
						/>
					)}
				</Col>
				<Col span={12}>
					<DiscountList isLoading={isLoading} discount_histories={data?.discount_histories || []} />
				</Col>
			</Row>
		</Card>
	);
};
