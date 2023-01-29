import { Col, Divider, Form, Row, Skeleton } from 'antd';
import { SkeletonInputProps } from 'antd/lib/skeleton/Input';
import { FC } from 'react';

const FormLabelSkeleton: FC<SkeletonInputProps> = ({ style = {}, ...rest }) => (
	<Skeleton.Input active style={{ height: 17, marginBottom: 12, ...style }} {...rest} />
);

const FormInputSkeleton: FC<SkeletonInputProps> = ({ style = {}, ...rest }) => (
	<Skeleton.Input active block size='large' style={{ borderRadius: 5, ...style }} {...rest} />
);

export const FormSkeleton = () => {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<div
					style={{
						width: '100%',
						height: 50,
						display: 'block',
						marginBottom: 16,
						borderBottom: '1px solid rgba(0,0,0,.06)',
					}}
				/>

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
								<FormLabelSkeleton size='small' />
								<FormLabelSkeleton />
							</Col>
							<Col span={12}>
								<FormLabelSkeleton size='small' />
								<FormLabelSkeleton />
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>

			{Array.from({ length: 7 }).map((_, index) => (
				<Col key={index} xl={12} xxl={8}>
					<Form.Item>
						<FormLabelSkeleton />
						<FormInputSkeleton />
					</Form.Item>
				</Col>
			))}

			<Col span={24}>
				<Divider />
				<Form.Item>
					<FormLabelSkeleton />
					<FormInputSkeleton style={{ maxWidth: 340, height: 80 }} />
				</Form.Item>
			</Col>
		</Row>
	);
};
