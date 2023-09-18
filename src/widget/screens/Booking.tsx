import { Button, Typography } from '@/components/atoms';
import { PassengerItem } from '@/containers/Bookings/BookingCreate/types';
import { publicAPI } from '@/libs/api/publicAPI';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Form, Input, Row, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SupplementModal from '../components/SupplementModal';
import { WidgetPassengerDetailsForm } from '../components/WidgetPassengerDetails';
import { useWidgetState } from '../libs/WidgetContext';
import { getSupplementMultiplier, isPerPerson } from '../libs/utills';
import '../styles/booking.less';

const Booking = () => {
	const [form] = Form.useForm();
	const passengers: Partial<PassengerItem>[] = Form.useWatch('passengers', form);

	const { state, updateState, formatCurrency } = useWidgetState();
	const [couponCode, setCouponCode] = useState('');
	const [appliedCoupon, setAppliedCoupon] = useState<{
		code: string;
		is_valid: boolean;
		discount: number;
		discount_type: 'amount' | 'percentage';
	}>();
	const { t } = useTranslation('translationWidget');
	const [isLoading, setIsLoading] = useState(false);
	const [tourDetails, setTourDetails] = useState<API.Tour>();
	const [isSubmitLoading, setSubmitLoading] = useState(false);
	const [isSupplementOpen, setSupplementOpen] = useState(false);
	const [verifyingCoupon, setVerifyingCoupon] = useState(false);
	const [selectedSupplements, setSelectedSupplements] = useState<{ [key: string]: number }>({});

	const number_of_passenger_took_transfer = useMemo(
		() =>
			passengers?.reduce((acc, passenger) => {
				return passenger?.transportation ? acc + 1 : acc;
			}, 0),
		[passengers]
	);

	const destination = [tourDetails?.location?.name, tourDetails?.country?.name]
		?.filter((item) => !!item)
		?.join(', ');

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
			return (
				prev +
				(supplement?.is_calculate
					? (supplement?.price || 0) *
					  curr.quantity *
					  getSupplementMultiplier(supplement, tourDetails)
					: 0)
			);
		}, 0);
		return tourPrice + supplementPrice;
	}, [tourDetails, selectedSupplementList, state?.remaining_capacity, findSupplementById]);

	const onFinish = useCallback(
		async (values: any) => {
			const createBookingPayload = {
				...values,
				tour: tourDetails?.id,
				number_of_passenger: values?.passengers?.length,
				number_of_passenger_took_transfer,
				supplements: selectedSupplementList,
				currency: tourDetails?.currency,
				passengers: values?.passengers?.map((passenger: any) => ({
					...passenger,
					date_of_birth: passenger.date_of_birth?.format('YYYY-MM-DD'),
				})),
				...(appliedCoupon?.code
					? { coupon_code: appliedCoupon?.code, discount_type: 'coupon' }
					: {}),
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
		[
			selectedSupplementList,
			tourDetails?.id,
			tourDetails?.currency,
			updateState,
			appliedCoupon?.code,
			number_of_passenger_took_transfer,
		]
	);

	const handleAddCoupon = useCallback(async () => {
		setVerifyingCoupon(true);
		try {
			const response = await publicAPI.verifyCoupon(tourDetails?.id as number, {
				code: couponCode,
			});
			if (response?.is_valid) {
				setAppliedCoupon({
					code: couponCode,
					...response,
				});
				message.success(t('Coupon has been applied!'));
			} else message.error(t('Invalid coupon code'));
		} catch (error) {
			console.log(error);
		}
		setVerifyingCoupon(false);
	}, [tourDetails?.id, couponCode, t]);

	const handleRemoveCoupon = useCallback(() => {
		setAppliedCoupon(undefined);
		setCouponCode('');
	}, []);

	const transferDiscount = useMemo(() => {
		const discountUnit = Number(state?.remaining_capacity) - number_of_passenger_took_transfer;
		return (tourDetails?.transfer_price || 0) * discountUnit;
	}, [tourDetails, number_of_passenger_took_transfer, state?.remaining_capacity]);

	useEffect(() => {
		if (!state?.selected_tour) return;
		setIsLoading(true);
		publicAPI.tour(state?.selected_tour).then((reponse) => {
			setTourDetails(reponse as API.Tour);
			setIsLoading(false);
		});
	}, [state?.selected_tour]);

	useEffect(() => {
		setSelectedSupplements((prev) => ({
			...prev,
			...tourDetails?.supplements?.reduce(
				(acc, curr) =>
					curr?.is_mandatory
						? {
								...acc,
								[curr?.id]: isPerPerson(curr) ? Number(state?.remaining_capacity) : 1,
						  }
						: acc,
				{}
			),
		}));
	}, [state?.remaining_capacity, findSupplementById, tourDetails?.supplements]);

	return (
		<Row gutter={[16, 16]}>
			<Col span={24} md={16}>
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
								{t('Passenger details')}
							</Typography.Title>
							<WidgetPassengerDetailsForm
								form={form}
								onFinish={onFinish}
								maxCapacity={tourDetails?.remaining_capacity}
							/>
						</Card>
					</Col>
				</Row>
			</Col>
			<Col span={24} md={8}>
				<Card loading={isLoading} className='cost-breakdown'>
					<Typography.Title level={4}>{t('Price breakdown')}</Typography.Title>
					<Row justify={'space-between'} gutter={[4, 4]} wrap={false}>
						<Col>{`${state.remaining_capacity} x ${tourDetails?.name}`}</Col>
						<Col>
							{formatCurrency(
								(tourDetails?.standard_price || 0) * Number(state?.remaining_capacity)
							)}
						</Col>
					</Row>
					{selectedSupplementList.map((item) => (
						<Row justify={'space-between'} key={item?.supplement} wrap={false} gutter={[4, 4]}>
							<Col>
								{`${item.quantity} x ${findSupplementById(Number(item?.supplement))?.name}`}
								{!findSupplementById(Number(item?.supplement))?.is_calculate ? (
									<span style={{ opacity: 0.75 }}>({t('Not included in total amount')})</span>
								) : null}
							</Col>
							<Col>
								{formatCurrency(
									(findSupplementById(Number(item?.supplement))?.price || 0) *
										item.quantity *
										getSupplementMultiplier(
											findSupplementById(Number(item?.supplement)),
											tourDetails
										)
								)}
							</Col>
						</Row>
					))}
					{appliedCoupon ? (
						<Row justify='space-between' wrap={false} gutter={[4, 4]}>
							<Col>{`${t('Coupon')}: ${appliedCoupon?.code}`}</Col>
							<Col>
								-
								{appliedCoupon?.discount_type === 'amount'
									? formatCurrency(appliedCoupon?.discount)
									: `${appliedCoupon?.discount}%`}
							</Col>
						</Row>
					) : null}
					{transferDiscount ? (
						<Row justify='space-between' wrap={false} gutter={[4, 4]}>
							<Col>{`${t('Transport cost deduction')}`}</Col>
							<Col>-{formatCurrency(transferDiscount)}</Col>
						</Row>
					) : null}
					{tourDetails?.tour_discount?.discount_amount ? (
						<Row justify='space-between' wrap={false} gutter={[4, 4]}>
							<Col>{`${t('Discount')}`}</Col>
							<Col>
								-
								{formatCurrency(
									tourDetails?.tour_discount?.discount_amount * Number(state.remaining_capacity)
								)}
							</Col>
						</Row>
					) : null}
					<Divider style={{ margin: '1rem 0 0.5rem 0' }} />
					<Row
						justify='space-between'
						style={{ marginBottom: '1rem' }}
						wrap={false}
						gutter={[4, 4]}
					>
						<Col>
							<Typography.Title level={5}>{t('Total')}</Typography.Title>
						</Col>
						<Col>
							<Typography.Title level={5}>
								{formatCurrency(
									total -
										(appliedCoupon?.discount_type === 'amount'
											? appliedCoupon?.discount
											: ((total -
													(tourDetails?.tour_discount?.discount_amount || 0) *
														Number(state.remaining_capacity)) *
													(appliedCoupon?.discount || 0)) /
											  100) -
										transferDiscount -
										(tourDetails?.tour_discount?.discount_amount || 0) *
											Number(state.remaining_capacity)
								)}
							</Typography.Title>
						</Col>
					</Row>
					<Row gutter={[12, 12]}>
						<Col flex='1'>
							<Input
								type='text'
								placeholder={t('Coupon')}
								value={couponCode}
								disabled={!!appliedCoupon?.code}
								onChange={(e) => setCouponCode(e.target.value)}
							/>
						</Col>
						<Col>
							{appliedCoupon?.code ? (
								<Button danger onClick={handleRemoveCoupon}>
									{t('Remove')}
								</Button>
							) : (
								<Button
									onClick={handleAddCoupon}
									loading={verifyingCoupon}
									disabled={couponCode === ''}
								>
									{t('Apply')}
								</Button>
							)}
						</Col>
					</Row>
					<Row style={{ marginTop: '1rem' }}>
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
			<Col span={24} md={16}>
				<Typography.Paragraph style={{ marginBottom: '1rem' }}>
					{t('Terms and conditions')}
				</Typography.Paragraph>
			</Col>
			<Col span={24} md={16}>
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
	);
};

export default Booking;
