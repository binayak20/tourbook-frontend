import { Button } from '@/components/atoms';
import { locationsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { selectFilterBy } from '@/utils/helpers';
import { Col, Form, Input, Row, Select } from 'antd';
import { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
};

export const LocationForm: FC<Props> = ({ onCancel, saveButtonText, isLoading }) => {
	const { t } = useTranslation();
	const { TextArea } = Input;
	const form = Form.useFormInstance();
	const territory = Form.useWatch('territory', form);

	const { data: territories } = useQuery('settings-territories', () =>
		locationsAPI.territories(DEFAULT_LIST_PARAMS)
	);

	const { data: countries } = useQuery(
		['countries', territory],
		() => locationsAPI.countries({ ...DEFAULT_LIST_PARAMS, territory }),
		{
			enabled: !!territory,
		}
	);

	const handleResetCountry = useCallback(() => {
		form.setFieldsValue({
			country: undefined,
		});
	}, [form]);

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
						<Select showSearch filterOption={selectFilterBy} onChange={handleResetCountry}>
							{territories?.results?.map((territory) => (
								<Select.Option
									key={territory.id}
									value={territory.id}
									disabled={!territory?.is_active}
								>
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
						<Select showSearch filterOption={selectFilterBy}>
							{countries?.results?.map((country) => (
								<Select.Option key={country.id} value={country.id} disabled={!country?.is_active}>
									{country.name}
								</Select.Option>
							))}
						</Select>
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
