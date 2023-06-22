import { Col, Row, Skeleton } from 'antd';

const InitialSkeleton = () => {
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
};

export default InitialSkeleton;
