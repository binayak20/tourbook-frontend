import { Button } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { selectFilterBy } from '@/utils/helpers';
import { Col, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
	isUpdated?: boolean;
};

export const EmailRecepientForm: FC<Props> = ({
	isLoading,
	onCancel,
	saveButtonText,
	isUpdated,
}) => {
	const { t } = useTranslation();
	const { data: eventEmails, isLoading: eventEmailLoading } = useQuery(['event-email'], () =>
		settingsAPI.getEmailEvent({ ...DEFAULT_LIST_PARAMS })
	);

	return (
		<>
			<Row gutter={16}>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<Form.Item
						label={t('Event')}
						name='email_event'
						rules={[{ required: true, message: t('Event email is required') }]}
					>
						<Select
							showSearch
							placeholder={t('Choose an option')}
							loading={eventEmailLoading}
							options={eventEmails?.results?.map(({ id, name }) => ({
								value: id,
								label: name,
							}))}
							filterOption={selectFilterBy}
							disabled={isUpdated}
						/>
					</Form.Item>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<Form.Item
						label={t('To email')}
						name='to_email'
						rules={[
							{ required: true, message: t('To email is required!') },
							{ type: 'email', message: t('Email is not a valid email!') },
						]}
					>
						<Input placeholder='To Email' />
					</Form.Item>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<Form.Item label={t('CC email')} name='cc_email'>
						<Select
							mode='tags'
							style={{
								width: '100%',
							}}
							tokenSeparators={[',', ' ']}
							open={false}
							suffixIcon={null}
						/>
					</Form.Item>
				</Col>
				<Col xs={12} sm={12} md={12} lg={12} xl={12}>
					<Form.Item label={t('Bcc email')} name='bcc_email'>
						<Select
							mode='tags'
							style={{
								width: '100%',
							}}
							tokenSeparators={[',', ' ']}
							open={false}
							suffixIcon={null}
						/>
					</Form.Item>
				</Col>
			</Row>

			<Row align='middle' justify='center'>
				<Col span={4}>
					<Button block type='cancel' htmlType='button' onClick={onCancel}>
						{t('Cancel')}
					</Button>
				</Col>
				<Col span={4} className='margin-4'>
					<Button block type='primary' htmlType='submit' loading={isLoading}>
						{t(`${saveButtonText}`)}
					</Button>
				</Col>
			</Row>
		</>
	);
};
