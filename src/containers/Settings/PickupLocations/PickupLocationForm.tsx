import { Button } from '@/components/atoms';
import { locationsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { selectFilterBy } from '@/utils/helpers';
import { Col, Form, Input, Popconfirm, Row, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
	formOperation?: 'create' | 'update';
	handleDelete?: () => void;
	isDeleteLoading?: boolean;
};

export const PickupLocationForm: FC<Props> = ({
	onCancel,
	saveButtonText,
	isLoading,
	formOperation,
	handleDelete,
	isDeleteLoading,
}) => {
	const { t } = useTranslation();
	const { TextArea } = Input;

	const { data: locations, isLoading: isLocationsLoading } = useQuery(
		['pickup-locations-location'],
		() => locationsAPI.list({ ...DEFAULT_LIST_PARAMS })
	);

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
						label={t('Location')}
						name='location'
						rules={[{ required: true, message: t('Location is required') }]}
					>
						<Select showSearch filterOption={selectFilterBy} loading={isLocationsLoading}>
							{locations?.results?.map(({ id, name, is_active }) => (
								<Select.Option key={id} value={id} disabled={!is_active}>
									{name}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Col>
				<Col lg={24}>
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
				{formOperation === 'update' && (
					<Col span={5} className='margin-4'>
						<Popconfirm
							placement='top'
							title={t(`Do you really want to delete?`)}
							onConfirm={handleDelete}
							okText={t('Yes')}
							cancelText={t('No')}
						>
							<Button block type='danger' loading={isDeleteLoading}>
								{t('Delete')}
							</Button>
						</Popconfirm>
					</Col>
				)}

				<Col span={5} className='margin-4'>
					<Button block type='primary' htmlType='submit' loading={isLoading}>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};
