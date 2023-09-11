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
	const { mutate: deleteDiscount, isLoading: isDeleteLoading } = useMutation(
		(id: number) => toursAPI.tourDiscountDelete(id),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('tour-discount-history');
				message.success(t('Discount has been deleted!'));
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);
	const deleteThisDiscount = () => {
		deleteDiscount(id);
	};
	return (
		<Card>
			<Row gutter={32}>
				<Col sm={24} md={24} lg={12}>
					{isLoading ? (
						<FormSkeleton />
					) : (
						<TourDiscountForm
							data={data}
							handleDelete={deleteThisDiscount}
							isDeleteLoading={isDeleteLoading}
						/>
					)}
				</Col>
				<Col sm={24} md={24} lg={12}>
					<DiscountList isLoading={isLoading} discount_histories={data?.discount_histories || []} />
				</Col>
			</Row>
		</Card>
	);
};
