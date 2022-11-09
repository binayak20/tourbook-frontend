import { Col, Divider, Form, Row, Skeleton } from 'antd';
import { SkeletonInputProps } from 'antd/lib/skeleton/Input';
import { FC, Fragment } from 'react';

const FormLabelSkeleton: FC<SkeletonInputProps> = ({ style = {}, ...rest }) => (
	<Skeleton.Input active style={{ height: 17, marginBottom: 12, ...style }} {...rest} />
);

const FormInputSkeleton: FC<SkeletonInputProps> = ({ style = {}, ...rest }) => (
	<Skeleton.Input active block size='large' style={{ borderRadius: 5, ...style }} {...rest} />
);

export const TourBasicsSkeleton = () => {
	return (
		<Fragment>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Row gutter={16} align='middle'>
						<Col xl={12}>
							<Form.Item>
								<FormLabelSkeleton />
								<FormInputSkeleton />
							</Form.Item>
						</Col>
						<Col xl={12} style={{ textAlign: 'center' }}>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item>
										<FormLabelSkeleton style={{ width: 120, minWidth: 120 }} block={false} />
										<FormInputSkeleton style={{ width: 100, minWidth: 100 }} block={false} />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item>
										<FormLabelSkeleton style={{ width: 120, minWidth: 120 }} block={false} />
										<FormInputSkeleton style={{ width: 100, minWidth: 100 }} block={false} />
									</Form.Item>
								</Col>
							</Row>
						</Col>
						{Array.from({ length: 6 }).map((_, index) => (
							<Col xl={12} xxl={8} key={index}>
								<Form.Item>
									<FormLabelSkeleton />
									<FormInputSkeleton />
								</Form.Item>
							</Col>
						))}
					</Row>
				</Col>
			</Row>

			<Divider />

			<div style={{ width: '100%', display: 'block', marginBottom: 20 }}>
				<Row>
					<Col span={12}>
						<Form.Item>
							<FormLabelSkeleton />
							<FormInputSkeleton style={{ height: 80 }} />
						</Form.Item>
					</Col>
				</Row>
			</div>

			<Row justify='center'>
				<Col span={24} style={{ textAlign: 'center' }}>
					<Skeleton.Button active size='large' style={{ minWidth: 120, borderRadius: 5 }} />
				</Col>
			</Row>
		</Fragment>
	);
};
