import { Button } from '@/components/atoms';
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons';
import { Card, Col, Image, Pagination, Row, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useWidgetState } from '../libs/WidgetContext';
import { useTours } from '../libs/hooks';
import '../styles/tours.less';

const TourList = () => {
	const { state, updateState, formatCurrency, redirects } = useWidgetState();
	const { tours, isLoading, pages } = useTours(state);

	const { t } = useTranslation('translationWidget');
	if (isLoading)
		return (
			<Row justify='center'>
				<Col style={{ padding: '3rem 0' }}>
					<Spin indicator={<LoadingOutlined style={{ fontSize: '1.5rem' }} />} />
				</Col>
			</Row>
		);
	return (
		<>
			{tours?.map((tour, index) => (
				<Card
					key={tour?.id}
					bodyStyle={{ padding: 0 }}
					className={`tour-card animation-fade-slide-in-${index}`}
				>
					<Row gutter={[4, 4]}>
						<Col span={24} md={6}>
							{tour?.images?.length ? (
								<Image
									// preview={{ visible: false }}
									width='100%'
									height='100%'
									src={tour?.images?.[0]}
								/>
							) : (
								<div
									style={{
										height: '100%',
										width: '100%',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: '#f0f0f0',
										color: '#bfbfbf',
									}}
								>
									<FileImageOutlined style={{ fontSize: '3rem' }} />
								</div>
							)}
						</Col>
						<Col span={24} md={18}>
							<div className='tour-card-info'>
								<div className='tour-card-info-left'>
									<div>
										<div>
											{[tour?.location?.name, tour?.country?.name]
												?.filter((item) => !!item)
												?.join(' - ')}
										</div>
										<div className='title'>{tour?.name}</div>
										<p>{tour?.description}</p>
									</div>
									<div>{tour?.departure_date}</div>
								</div>
								<div className='tour-card-info-right'>
									<div className='capacity'>{`${tour?.remaining_capacity} places left`}</div>
									<div className='tour-card-info-right-bottom'>
										<div className='price'>
											{formatCurrency(
												tour?.tour_discount
													? tour?.tour_discount?.standard_price_after_discount
													: tour?.standard_price
											)}
											{tour?.tour_discount ? (
												<>
													<div className='discount'>{formatCurrency(tour?.standard_price)}</div>
													{tour?.tour_discount?.discount_type === 'percentage' ? (
														<div className='discount percent'>
															-{tour?.tour_discount?.discount_value}%
														</div>
													) : null}
												</>
											) : null}
										</div>
										<Button
											type='primary'
											size='large'
											onClick={() =>
												updateState(
													{
														widget_screen: 'booking',
														selected_tour: tour?.id?.toString(),
													},
													redirects?.bookingURL as string
												)
											}
										>
											{t('Book')}
										</Button>
									</div>
								</div>
							</div>
						</Col>
					</Row>
				</Card>
			))}
			<Pagination
				pageSize={state?.limit}
				current={state?.page}
				onChange={(page) => updateState({ page })}
				total={pages}
				showSizeChanger={false}
			/>
		</>
	);
};

export default TourList;
