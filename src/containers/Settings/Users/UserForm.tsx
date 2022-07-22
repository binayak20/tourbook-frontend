import { Button, Switch } from '@/components/atoms';
import { usersAPI } from '@/libs/api';
import { readableText } from '@/utils/helpers';
import { Col, Form, Input, Row, Select, Spin } from 'antd';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
	isLoading?: boolean;
	isEmailDisabled?: boolean;
};

export const UserForm: FC<Props> = ({
	onCancel,
	saveButtonText,
	isLoading: isSaveButtonLoading,
	isEmailDisabled,
}) => {
	const { t } = useTranslation();

	const { isLoading, data } = useQuery(['userRoles'], () => usersAPI.userFilteredRoles());

	const roleOptions = useMemo(() => {
		if (data?.length) {
			return data.map(({ id, name }) => ({
				label: readableText(name),
				value: id,
			}));
		}

		return [];
	}, [data]);

	return (
		<>
			<Row gutter={40}>
				<Col lg={12}>
					<Form.Item
						label={t('First Name')}
						name='first_name'
						rules={[{ required: true, message: t('First name is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12}>
					<Form.Item
						label={t('Last Name')}
						name='last_name'
						rules={[{ required: true, message: t('Last name is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col lg={12}>
					<Form.Item
						label={t('Email Address')}
						name='email'
						rules={[
							{ required: true, message: t('Email address is required!') },
							{ type: 'email', message: t('Email address is invalid!') },
						]}
					>
						<Input disabled={isEmailDisabled} />
					</Form.Item>
				</Col>
				<Col lg={12}>
					<Form.Item label={t('Role')} name='groups'>
						<Select
							size='large'
							mode='multiple'
							placeholder={t('Choose a role')}
							notFoundContent={isLoading ? <Spin size='small' /> : null}
							options={roleOptions}
						/>
					</Form.Item>
				</Col>
				<Col>
					<Form.Item
						name='is_superuser'
						label={t('Is this user a super admin?')}
						valuePropName='checked'
					>
						<Switch custom checkedChildren={t('Yes')} unCheckedChildren={t('No')} />
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
					<Button block type='primary' htmlType='submit' loading={isSaveButtonLoading}>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};
