import { Col, Form, Row, Skeleton } from 'antd';
import { SkeletonInputProps } from 'antd/lib/skeleton/Input';
import { FC } from 'react';

const FormLabelSkeleton: FC<SkeletonInputProps> = ({ style = {}, ...rest }) => (
	<Skeleton.Input active style={{ height: 17, marginBottom: 12, ...style }} {...rest} />
);

const FormInputSkeleton: FC<SkeletonInputProps> = ({ style = {}, ...rest }) => (
	<Skeleton.Input active block size='large' style={{ borderRadius: 5, ...style }} {...rest} />
);

type FormSkeletonProps = {
	type?: 'tourType';
};

export const FormSkeleton: FC<FormSkeletonProps> = ({ type }) => (
	<Row gutter={[16, 16]}>
		{type !== 'tourType' && (
			<Col span={24}>
				<Row>
					<Col xl={12} xxl={8}>
						<Form.Item>
							<FormLabelSkeleton />
							<FormInputSkeleton />
						</Form.Item>
					</Col>
				</Row>
			</Col>
		)}

		{Array.from({ length: type === 'tourType' ? 4 : 6 }).map((_, index) => (
			<Col key={index} xl={12} xxl={8}>
				<Form.Item>
					<FormLabelSkeleton />
					<FormInputSkeleton />
				</Form.Item>
			</Col>
		))}

		<Col xl={12} xxl={8}>
			<Form.Item>
				<FormLabelSkeleton />
				<FormInputSkeleton style={{ height: 123 }} />
			</Form.Item>
		</Col>

		{Array.from({ length: 14 }).map((_, index) => (
			<Col key={index} xl={12} xxl={8}>
				<Form.Item>
					<FormLabelSkeleton />
					<FormInputSkeleton />
				</Form.Item>
			</Col>
		))}
	</Row>
);
