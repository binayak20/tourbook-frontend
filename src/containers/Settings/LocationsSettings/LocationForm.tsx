import { Button } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { Territory } from '@/libs/api/@types/settings';
import { Col, Form, Input, Row, Select } from 'antd';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
};

export const LocationForm: FC<Props> = ({ onCancel, saveButtonText, isLoading }) => {
	const { t } = useTranslation();
	const { data: territories } = useQuery('settings-locations-territory', () =>
		settingsAPI.territories()
	);
	const territoryList = useMemo(() => territories?.results, [territories]);

	return (
		<>
			<Row gutter={40}>
				<Col lg={12}>
					<Form.Item
						label={t('Name')}
						name='name'
						rules={[{ required: true, message: t('Name is required') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12}>
					<Form.Item label={t('Territory')} name='territory'>
						<Select>
							{territoryList?.map((territory: Territory) => (
								<Select.Option key={territory.id} value={territory.id}>
									{territory.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
			</Row>
			<Row align='middle' justify='center'>
				<Col span={3}>
					<Button block type='cancel' htmlType='button' onClick={onCancel}>
						{t('Cancel')}
					</Button>
				</Col>
				<Col span={3} className='margin-4'>
					<Button block type='primary' htmlType='submit' loading={isLoading}>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};
