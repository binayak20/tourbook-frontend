import { Col, Row, Skeleton, Spin } from 'antd';
import { TWidgetState } from '../libs/WidgetContext';
import '../styles/skeleton.less';

const InitialSkeleton = ({ type }: { type: TWidgetState['widget_screen'] | 'search' }) => {
	switch (type) {
		case 'search':
			return (
				<Row gutter={[8, 8]} justify='space-evenly'>
					<Col flex={1}>
						<Skeleton.Input active={true} size='large' block />
					</Col>
					<Col flex={1}>
						<Skeleton.Input active={true} size='large' block />
					</Col>
					<Col flex={1}>
						<Skeleton.Input active={true} size='large' block />
					</Col>
					<Col flex={1}>
						<Skeleton.Input active={true} size='large' block />
					</Col>
					<Col flex={1}>
						<Skeleton.Button active={true} size='large' block />
					</Col>
				</Row>
			);
		case 'list':
			return (
				<>
					<Row gutter={[8, 8]} justify='space-evenly' style={{ marginBottom: '2rem' }}>
						<Col flex={1}>
							<Skeleton.Input active={true} size='large' block />
						</Col>
						<Col flex={1}>
							<Skeleton.Input active={true} size='large' block />
						</Col>
						<Col flex={1}>
							<Skeleton.Input active={true} size='large' block />
						</Col>
						<Col flex={1}>
							<Skeleton.Input active={true} size='large' block />
						</Col>
						<Col flex={1}>
							<Skeleton.Button active={true} size='large' block />
						</Col>
					</Row>

					<Row gutter={[8, 8]}>
						{[...Array(4)].map((_, index) => (
							<Col span={24} key={index}>
								<Row gutter={[8, 8]}>
									<Col span={6} className='image-container'>
										<Skeleton.Image active={true} style={{ height: '100%', width: '100%' }} />
									</Col>
									<Col span={14}>
										<Row align={'stretch'} gutter={[8, 8]}>
											<Col span={24}>
												<Row gutter={[8, 8]}>
													<Col span={24}>
														<Skeleton.Input active={true} size='small' />
													</Col>
													<Col span={24}>
														<Skeleton.Input active={true} size='large' />
													</Col>
												</Row>
											</Col>
											<Col span={24} style={{ marginTop: '2.2rem' }}>
												<Skeleton.Input active={true} size='small' />
											</Col>
										</Row>
									</Col>
									<Col span={4}>
										<Row align='stretch' justify='end' style={{ height: '100%' }}>
											<Col>
												<Skeleton.Input active={true} size='small' />
											</Col>
											<Col style={{ display: 'flex', alignItems: 'flex-end' }}>
												<Skeleton.Button active={true} size='large' />
											</Col>
										</Row>
									</Col>
								</Row>
							</Col>
						))}
					</Row>
				</>
			);
		default:
			return <Spin />;
	}
};

export default InitialSkeleton;
