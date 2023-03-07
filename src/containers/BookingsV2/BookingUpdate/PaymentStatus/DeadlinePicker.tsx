import { Typography } from '@/components/atoms';
import config from '@/config';
import { CloseCircleFilled, EditOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Row } from 'antd';
import moment from 'moment';
import { Fragment, useState } from 'react';
import styled from 'styled-components';
import { FormInputSkeleton, FormLabelSkeleton } from '../FormSkeleton';

type DeadlinePickerProps = {
	label: string;
	value: Date;
	onChange: (value: moment.Moment | null) => void;
	disabled?: boolean;
	loading?: boolean;
};

export const DeadlinePicker: React.FC<DeadlinePickerProps> = ({
	label,
	value,
	onChange,
	disabled = false,
	loading = false,
}) => {
	const [isFieldVisible, setFieldVisible] = useState(false);

	if (loading) {
		return (
			<Form.Item>
				<FormLabelSkeleton />
				<FormInputSkeleton />
			</Form.Item>
		);
	}

	return (
		<Form.Item label={label}>
			{isFieldVisible ? (
				<Fragment>
					<DatePickerField
						size='large'
						value={moment(value)}
						onChange={onChange}
						disabled={disabled}
						clearIcon={<CloseCircleFilled onClick={() => setFieldVisible(false)} />}
					/>
				</Fragment>
			) : (
				<Row gutter={12} align='middle' justify='space-between'>
					<Col>
						<Typography.Text type='warning'>
							{moment(value).format(config.dateFormatReadable)}
						</Typography.Text>
					</Col>
					<Col>
						<Button
							type='link'
							size='small'
							icon={<EditOutlined />}
							onClick={() => setFieldVisible(true)}
							disabled={disabled}
						/>
					</Col>
				</Row>
			)}
		</Form.Item>
	);
};

const DatePickerField = styled(DatePicker)`
	width: 100%;
`;