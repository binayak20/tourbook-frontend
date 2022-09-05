import config from '@/config';
import { GENDER_OPTIONS, NAME_INITIALS } from '@/utils/constants';
import { DeleteOutlined, SwapOutlined } from '@ant-design/icons';
import { Badge, Button, ButtonProps, Card, Col, Divider, Row, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FormValues } from '.';

type PassengersProps = {
	data?: FormValues[];
	updateData?: (data: FormValues[]) => void;
};

type PassengerProps = {
	data: FormValues;
	primaryBtnProps?: ButtonProps;
	removeBtnProps?: ButtonProps & { isVisble?: boolean };
};

const Passenger: FC<PassengerProps> = (props) => {
	const {
		data: {
			is_child,
			is_primary,
			name_initial,
			first_name,
			last_name,
			email,
			date_of_birth,
			gender,
			phone_number,
			passport_number,
			is_allergy,
		},
		primaryBtnProps,
		removeBtnProps: { isVisble: isRemoveBtnVisible = true, ...removeBtnProps } = { isVisble: true },
	} = props;
	const { t } = useTranslation();

	const passengerNameInitial = useMemo(() => {
		if (!name_initial) {
			return '';
		}

		return NAME_INITIALS.find((item) => item.value === name_initial)?.label || '';
	}, [name_initial]);

	const passengerGender = useMemo(() => {
		if (!gender) {
			return '';
		}

		return GENDER_OPTIONS.find((item) => item.value === gender)?.label || '';
	}, [gender]);

	return (
		<Card style={{ minHeight: 250, marginTop: 16 }} bodyStyle={{ padding: '8px 16px' }}>
			<Row gutter={8} align='middle' justify='space-between'>
				<Col>
					<Badge
						style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
						count={is_child ? t('Child') : t('Adult')}
					/>
					{is_primary && <Badge count={t('Primary')} style={{ marginLeft: 8 }} />}
				</Col>
				<Col>
					{!is_primary && (
						<Tooltip overlayInnerStyle={{ fontSize: 12 }} title={t('Primary')}>
							<Button size='small' type='link' icon={<SwapOutlined />} {...primaryBtnProps} />
						</Tooltip>
					)}
					{isRemoveBtnVisible && (
						<Tooltip overlayInnerStyle={{ fontSize: 12 }} title={t('Remove')}>
							<Button
								danger
								size='small'
								type='link'
								icon={<DeleteOutlined />}
								{...removeBtnProps}
							/>
						</Tooltip>
					)}
				</Col>
			</Row>

			<Typography.Paragraph strong className='margin-0'>
				{passengerNameInitial} {first_name} {last_name}
			</Typography.Paragraph>
			<Typography.Paragraph className='margin-0'>{email}</Typography.Paragraph>
			<Typography.Paragraph className='margin-0'>
				DOB: {moment(date_of_birth).format(config.dateFormat)}
			</Typography.Paragraph>
			{passengerGender && (
				<Typography.Paragraph className='margin-0'>
					{t('Gender')}: {passengerGender}
				</Typography.Paragraph>
			)}
			{phone_number && (
				<Typography.Paragraph className='margin-0'>
					{t('Phone')}: {phone_number}
				</Typography.Paragraph>
			)}
			{passport_number && (
				<Typography.Paragraph className='margin-0'>
					{t('Passport')}: {passport_number}
				</Typography.Paragraph>
			)}
			<Typography.Paragraph className='margin-0'>
				{t('Does the traveler have food allergies?')}: {is_allergy ? t('Yes') : t('No')}
			</Typography.Paragraph>
		</Card>
	);
};

export const Passengers: FC<PassengersProps> = ({ data, updateData }) => {
	if (!data?.length) return null;

	const handlePrimary = useCallback(
		(index: number) => {
			if (!updateData) return;

			const newData = [...data];
			newData.forEach((item, i) => {
				item.is_primary = i === index;
			});

			updateData(newData);
		},
		[data, updateData]
	);

	const handleRemove = useCallback(
		(index: number) => {
			if (!updateData) return;

			const newData = [...data];
			newData.splice(index, 1);
			updateData(newData || []);
		},
		[data, updateData]
	);

	return (
		<Row>
			<Col span={24}>
				<Row gutter={16}>
					{data.map((passengers, index) => (
						<Col key={index} span={8}>
							<Passenger
								data={passengers}
								primaryBtnProps={{
									onClick: () => handlePrimary(index),
								}}
								removeBtnProps={{
									isVisble: !passengers.is_primary,
									onClick: () => handleRemove(index),
								}}
							/>
						</Col>
					))}
				</Row>

				<Divider />
			</Col>
		</Row>
	);
};
