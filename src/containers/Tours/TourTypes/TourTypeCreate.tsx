import { Typography } from '@/components/atoms';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { SupplementsPicker } from './SupplementsPicker';

export const TourTypeCreate = () => {
	const { t } = useTranslation();

	return (
		<Row>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle'>
					<Col span={24}>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Create tour type')}
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Card>
					<Form size='large' layout='vertical' onFinish={(e) => console.log(e)}>
						<Row gutter={[16, 16]}>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Name')}
									name='name'
									rules={[{ required: true, message: 'Please enter name of tour type!' }]}
								>
									<Input placeholder={t('Name of tour type')} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item label={t('Boats')} required>
									<Input />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Duration in days')}
									name='duration'
									rules={[{ required: true, message: 'Duration days is required!' }]}
								>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item label={t('Description')} name='description'>
									<Input.TextArea rows={5} placeholder={t('Write text here...')} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Card style={{ backgroundColor: 'rgb(231, 238, 248)' }}>
									<Typography.Title type='primary' level={5}>
										{t('Tour capacity')}
									</Typography.Title>
									<Typography.Title type='primary' level={2} style={{ margin: 0 }}>
										0
									</Typography.Title>
								</Card>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Location')}
									name='location'
									rules={[{ required: true, message: 'Please choose an option!' }]}
								>
									<Select placeholder={t('Choose an option')} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item label={t('Fortnox cost center')} name='fortnox_cost_center'>
									<Select placeholder={t('Choose an option')} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Tour type category')}
									name='category'
									rules={[{ required: true, message: 'Please choose an option!' }]}
								>
									<Select placeholder={t('Choose an option')} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Standard price (base)')}
									name='standard_price'
									rules={[{ required: true, message: 'Please enter standard price!' }]}
								>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Transfer cost')}
									name='transfer_cost'
									rules={[{ required: true, message: 'Please enter transfer cost!' }]}
								>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Cancel fee (percent)')}
									name='cancel_fee'
									rules={[{ required: true, message: 'Please enter cancelation fee!' }]}
								>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item
									label={t('Booking fee (percent)')}
									name='booking_fee'
									rules={[{ required: true, message: 'Please enter booking fee!' }]}
								>
									<InputNumber style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							<Col xl={12} xxl={8}>
								<Form.Item label={t('Pickup')} name='pickup'>
									<Select placeholder={t('Choose an option')} />
								</Form.Item>
							</Col>
						</Row>

						<SupplementsPicker />

						<Row gutter={16} justify='center'>
							<Col>
								<Button type='default' style={{ minWidth: 180 }}>
									{t('Cancel')}
								</Button>
							</Col>
							<Col>
								<Button htmlType='submit' type='primary' style={{ minWidth: 180 }}>
									{t('Save tour type')}
								</Button>
							</Col>
						</Row>
					</Form>
				</Card>
			</Col>
		</Row>
	);
};
