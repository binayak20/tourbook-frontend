import { Button } from '@/components/atoms';
import { stationsAPI } from '@/libs/api';
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
};

export const StationForm: FC<Props> = ({ onCancel, saveButtonText, isLoading }) => {
	const { t } = useTranslation();
	const { TextArea } = Input;

	const { data: stationTypes } = useQuery('station-types', () =>
		stationsAPI.types(DEFAULT_LIST_PARAMS)
	);

	const stations = stationTypes?.results;
	const OtherStation = stations?.filter((station) => station.name == 'Other');

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
						label={t('Station type')}
						name='station_type'
						rules={[{ required: true, message: t('Station is required') }]}
					>
						<Select showSearch filterOption={selectFilterBy}>
							{OtherStation?.map((Station) => (
								<Select.Option key={Station.id} value={Station.id} disabled={!Station?.is_active}>
									{Station?.name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col lg={12}>
					<Form.Item label={t('Station code')} name='station_code'>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12}>
					<Form.Item label={t('Description')} name='description'>
						<TextArea rows={3} />
					</Form.Item>
				</Col>
			</Row>
			<Row align='middle' justify='center'>
				<Col span={5}>
					<Button block type='cancel' htmlType='button' onClick={onCancel}>
						{t('Cancel')}
					</Button>
				</Col>
				<Col span={5} className='margin-4'>
					<Button block type='primary' htmlType='submit' loading={isLoading}>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};
