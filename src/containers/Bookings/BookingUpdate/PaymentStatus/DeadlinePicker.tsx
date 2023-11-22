import { Typography } from '@/components/atoms';
import { useBookingContext } from '@/components/providers/BookingProvider';
import config from '@/config';
import { CloseCircleFilled, EditOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { Fragment, useState } from 'react';

import { FormInputSkeleton, FormLabelSkeleton } from '../FormSkeleton';
import PaymentReminder from './PaymentReminder';

type DeadlinePickerProps = {
	label: string;
	value: Date;
	onChange: (value: any) => void;
	disabled?: boolean;
	loading?: boolean;
	reminderType?: 'first_payment' | 'second_payment' | 'residue_payment';
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
					<DatePicker
						format={['YYYY-MM-DD', 'YYYYMMDD', 'YYMMDD', 'YYYY/MM/DD']}
						size='large'
						value={dayjs(value)}
						onChange={onChange}
						disabled={disabled}
						style={{ width: '100%' }}
						clearIcon={<CloseCircleFilled onClick={() => setFieldVisible(false)} />}
					/>
				</Fragment>
			) : (
				<Row gutter={12} align='middle' justify='space-between'>
					<Col>
						<Typography.Text type='warning'>
							{dayjs(value).format(config.dateFormatReadable)}
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
