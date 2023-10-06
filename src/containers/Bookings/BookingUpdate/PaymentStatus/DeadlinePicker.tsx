import { Typography } from '@/components/atoms';
import config from '@/config';
import { CloseCircleFilled, EditOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Row, Tooltip } from 'antd';
import moment from 'moment';
import { Fragment, useState } from 'react';
import styled from 'styled-components';
import { FormInputSkeleton, FormLabelSkeleton } from '../FormSkeleton';
import PaymentReminder from './PaymentReminder';
import { useBookingContext } from '@/components/providers/BookingProvider';

type DeadlinePickerProps = {
	label: string;
	value: Date;
	onChange: (value: moment.Moment | null) => void;
	disabled?: boolean;
	loading?: boolean;
	reminderType?: 'first_payment' | 'residue_payment';
};

export const DeadlinePicker: React.FC<DeadlinePickerProps> = ({
	label,
	value,
	onChange,
	disabled = false,
	loading = false,
	reminderType,
}) => {
	const [isFieldVisible, setFieldVisible] = useState(false);
	const {
		bookingInfo: { id },
	} = useBookingContext();

	if (loading) {
		return (
			<Form.Item>
				<FormLabelSkeleton />
				<FormInputSkeleton />
			</Form.Item>
		);
	}

	return (
		<Form.Item
			label={
				<Tooltip placement='top' title={label}>
					<span>{label.length > 30 ? `${label.slice(0, 24)}...` : label}</span>
				</Tooltip>
			}
		>
			{isFieldVisible ? (
				<Fragment>
					<DatePickerField
						format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
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
						{reminderType && <PaymentReminder id={id} deadline_type={reminderType} />}
					</Col>
				</Row>
			)}
		</Form.Item>
	);
};

const DatePickerField = styled(DatePicker)`
	width: 100%;
`;
