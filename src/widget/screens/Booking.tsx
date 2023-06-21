import { Button, Typography } from '@/components/atoms';
import { publicAPI } from '@/libs/api/publicAPI';
import { formatCurrency } from '@/utils/helpers';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Card, Col, Form, Row } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PassengerDetailsForm } from '../components/PassengerDetailsForm';
import SupplementModal from '../components/SupplementModal';
import { useWidgetState } from '../libs/WidgetContext';
import '../styles/booking.less';

const Booking = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { state, updateState } = useWidgetState();
	const [tourDetails, setTourDetails] = useState<API.Tour>();
	const [isLoading, setIsLoading] = useState(false);
	const [isSupplementOpen, setSupplementOpen] = useState(false);
	const [selectedSupplements, setSelectedSupplements] = useState<{ [key: string]: number }>({});
	const [isSubmitLoading, setSubmitLoading] = useState(false);

	const destination = [tourDetails?.location?.name, tourDetails?.country?.name]
		?.filter((item) => !!item)
		?.join(',');

	const selectedSupplementList = Object.keys(selectedSupplements).map((key) => ({
		supplement: Number(key),
		quantity: selectedSupplements[key],
	}));

	const findSupplementById = useCallback(
		(id: number) => tourDetails?.supplements?.find((supplement) => supplement.id === id),
		[tourDetails?.supplements]
	);

	const total = useMemo(() => {
		const tourPrice = (tourDetails?.standard_price || 0) * Number(state?.remaining_capacity);
		const supplementPrice = selectedSupplementList?.reduce((prev, curr) => {
			const supplement = findSupplementById(Number(curr.supplement));
			return prev + (supplement?.price || 0) * curr.quantity;
		}, 0);
		return tourPrice + supplementPrice;
	}, [tourDetails, selectedSupplementList, state?.remaining_capacity, findSupplementById]);

	const onFinish = useCallback(
		async (values: any) => {
			const createBookingPayload = {
				...values,
				tour: tourDetails?.id,
				number_of_passenger: values?.passengers?.length,
				number_of_passenger_took_transfer: 0,
				supplements: selectedSupplementList,
				currency: tourDetails?.currency,
				passengers: values?.passengers?.map((passenger: any) => ({
					...passenger,
					date_of_birth: passenger.date_of_birth?.format('YYYY-MM-DD'),
				})),
			};
			setSubmitLoading(true);
			try {
				await publicAPI.createBooking(createBookingPayload);
				updateState({ widget_screen: 'success' });
			} catch (error) {
				console.log(error);
			}
			setSubmitLoading(false);
		},
		[selectedSupplementList, tourDetails?.id, tourDetails?.currency, updateState]
	);

	useEffect(() => {
		if (!state?.selected_tour) return;
		setIsLoading(true);
		publicAPI.tour(state?.selected_tour).then((reponse) => {
			setTourDetails(reponse as API.Tour);
			setIsLoading(false);
		});
	}, [state?.selected_tour]);

	return (
		<Row gutter={[16, 16]}>
			<Col span={16}>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<Card loading={isLoading}>
							<Typography.Title level={4}>{tourDetails?.name}</Typography.Title>
							<Typography.Text>{`${destination}, ${tourDetails?.departure_date} - ${tourDetails?.return_date}`}</Typography.Text>
						</Card>
					</Col>
					<Col span={24}>
						<Card>
							<Typography.Title level={4} style={{ marginBottom: '1rem' }}>
								{t('Passenger Details')}
							</Typography.Title>
							<PassengerDetailsForm form={form} onFinish={onFinish} />
						</Card>
					</Col>
					<Col span={24}>
						<Typography.Paragraph style={{ marginBottom: '1rem' }}>
							{t('Terms and conditions')}
						</Typography.Paragraph>
					</Col>
					<Col span={24}>
						<Button
							type='primary'
							block
							form='passenger_details_form'
							htmlType='submit'
							size='large'
							loading={isSubmitLoading}
						>
							{t('Submit')}
						</Button>
					</Col>
				</Row>
			</Col>
			<Col span={8}>
				<Card loading={isLoading} style={{ position: 'sticky', top: '16px' }}>
					<Typography.Title level={4}>Price Breakdown</Typography.Title>
					<Row justify={'space-between'}>
						<Col>{`${state.remaining_capacity} x ${tourDetails?.name}`}</Col>
						<Col>
							{formatCurrency(
								(tourDetails?.standard_price || 0) * Number(state?.remaining_capacity)
							)}
						</Col>
					</Row>
					{selectedSupplementList.map((item) => (
						<Row justify={'space-between'} key={item?.supplement}>
							<Col>{`${item.quantity} x ${
								findSupplementById(Number(item?.supplement))?.name
							}`}</Col>
							<Col>
								{formatCurrency(
									(findSupplementById(Number(item?.supplement))?.price || 0) * item.quantity
								)}
							</Col>
						</Row>
					))}
					<Row justify='space-between'>
						<Col>
							<Typography.Title level={5}>Total</Typography.Title>
						</Col>
						<Col>
							<Typography.Title level={5}>{formatCurrency(total)}</Typography.Title>
						</Col>
					</Row>
					<Row style={{ marginTop: '2rem' }}>
						<Col span={24}>
							<Button
								onClick={() => setSupplementOpen(true)}
								type='dashed'
								icon={<AppstoreAddOutlined />}
								block
							>
								{t('Add Supplements')}
							</Button>
							<SupplementModal
								open={isSupplementOpen}
								onCancel={() => setSupplementOpen(false)}
								tourDetails={tourDetails}
								supplements={selectedSupplements}
								setSupplements={setSelectedSupplements}
							/>
						</Col>
					</Row>
				</Card>
			</Col>
		</Row>
	);
};

export default Booking;
