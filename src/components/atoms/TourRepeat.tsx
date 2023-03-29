import { Col, Form, InputNumber, Radio, RadioChangeEvent, Row, Select } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MultipleDatePicker from './MultidatePicker';

function TourRepeat({ form }: { form: any }) {
	const { t } = useTranslation();
	const [repeatType, setRepatType] = useState<'specified' | 'interval'>('specified');
	const options = [
		{ label: 'Date', value: 'specified' },
		{ label: 'Interval', value: 'interval' },
	];
	const onRepeatTypeChange = ({ target: { value } }: RadioChangeEvent) => {
		setRepatType(value);
		form.setFieldsValue({
			repeat_departure_dates: undefined,
			repeat_interval: undefined,
			repeat_type: undefined,
			repeat_for: undefined,
		});
	};
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<Radio.Group
					optionType='button'
					options={options}
					onChange={onRepeatTypeChange}
					value={repeatType}
				/>
			</Col>

			{repeatType === 'interval' ? (
				<>
					<Col xl={8}>
						<Form.Item
							label={t('Each')}
							name='repeat_interval'
							rules={[{ required: true, message: t('Reserve seats is required!') }]}
						>
							<InputNumber
								style={{ width: '100%' }}
								placeholder={t('Duration between repeats')}
								min={0}
							/>
						</Form.Item>
					</Col>
					<Col xl={8}>
						<Form.Item
							label={t('Repeat type')}
							name='repeat_type'
							rules={[{ required: true, message: t('Repeat type is required') }]}
						>
							<Select
								placeholder={t('Weeks or Months')}
								options={[
									{ label: 'Weeks', value: 'weeks' },
									{ label: 'Months', value: 'months' },
								]}
							/>
						</Form.Item>
					</Col>
					<Col xl={8}>
						<Form.Item
							label={t('Repeat for')}
							name='repeat_for'
							rules={[{ required: true, message: t('Repeat for is required') }]}
						>
							<InputNumber style={{ width: '100%' }} placeholder={t('Number of repeats')} min={0} />
						</Form.Item>
					</Col>
				</>
			) : (
				<Col xl={24}>
					<Form.Item label={t('Departure dates')} name='repeat_departure_dates'>
						<MultipleDatePicker />
					</Form.Item>
				</Col>
			)}
		</Row>
	);
}

export default TourRepeat;
