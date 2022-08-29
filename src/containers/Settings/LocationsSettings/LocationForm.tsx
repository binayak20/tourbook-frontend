import { Button } from '@/components/atoms';
import { locationsAPI } from '@/libs/api';
import { Col, Form, Input, Row, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
};

export const LocationForm: FC<Props> = ({ onCancel, saveButtonText, isLoading }) => {
	const { t } = useTranslation();
	const { data: territories } = useQuery('territories', () => locationsAPI.territories({}));
	const { data: countries } = useQuery('countries', () => locationsAPI.countries());

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
					<Form.Item
						label={t('Territory')}
						name='territory'
						rules={[{ required: true, message: t('Territory is required') }]}
					>
						<Select>
							{territories?.results?.map((territory) => (
								<Select.Option key={territory.id} value={territory.id}>
									{territory.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col lg={12}>
					<Form.Item
						label={t('Country')}
						name='country'
						rules={[{ required: true, message: t('Country is required') }]}
					>
						<Select>
							{countries?.results?.map((country) => (
								<Select.Option key={country.id} value={country.id}>
									{country.name}
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
