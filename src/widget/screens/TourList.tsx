import { Button } from '@/components/atoms';
import { LoadingOutlined } from '@ant-design/icons';
import { Card, Col, Pagination, Row, Spin } from 'antd';
import { useWidgetState } from '../libs/WidgetContext';
import { useTours } from '../libs/hooks';
import { currencyFormatter } from '../libs/utills';
import '../styles/tours.less';

const TourList = () => {
	const { state, updateState } = useWidgetState();
	const { tours, isLoading, pages } = useTours(state);

	if (state?.widget_screen !== 'list') return null;
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
							<img
								className='tour-card-image'
								src='https://moresailing-prod-media-bucket.fra1.digitaloceanspaces.com/640_IMG_5679_7d1c19b667.jpg'
							/>
						</Col>
						<Col span={24} md={18}>
							<div className='tour-card-info'>
								<div className='tour-card-info-left'>
									<div>
										<div>{`${tour?.location?.name} - ${tour?.country?.name}`}</div>
										<div className='title'>{tour?.name}</div>
									</div>
									<div>{tour?.departure_date}</div>
								</div>
								<div className='tour-card-info-right'>
									<div className='capacity'>{`${tour?.remaining_capacity} places left`}</div>
									<div className='tour-card-info-right-bottom'>
										<div className='price'>{currencyFormatter(tour?.standard_price)}</div>
										<Button type='primary' size='large'>
											Book
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
