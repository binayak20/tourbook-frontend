import { Col, Divider, Form, Row, Skeleton, Tabs, TabsProps } from 'antd';
import { SkeletonInputProps } from 'antd/lib/skeleton/Input';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const FormLabelSkeleton: FC<SkeletonInputProps> = ({ style = {}, ...rest }) => (
	<Skeleton.Input active style={{ height: 17, marginBottom: 12, ...style }} {...rest} />
);

export const FormInputSkeleton: FC<SkeletonInputProps> = ({ style = {}, ...rest }) => (
	<Skeleton.Input active block size='large' style={{ borderRadius: 5, ...style }} {...rest} />
);

export const FormSkeleton = () => {
	const { t } = useTranslation();

	const items = [
		{ key: 1, label: t('Tour Basics'), disabled: true },
		{ key: 2, label: t('Passenger Details'), disabled: true },
		{ key: 3, label: t('Payments'), disabled: true },
	] as unknown as TabsProps['items'];

	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<Tabs items={items} activeKey='0' />

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

			{Array.from({ length: 8 }).map((_, index) => (
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
