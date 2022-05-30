import { Button } from '@/components/atoms';
import { translationKeys } from '@/config/translate/i18next';
import { userRoles } from '@/utils/constants';
import { Col, Form, Input, Row, Select } from 'antd';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
	onCancel?: () => void;
	saveButtonText?: string;
};

export const UsersForm: FC<Props> = ({ onCancel, saveButtonText }) => {
	const { t } = useTranslation();

	const userRolesWithTranslations = useMemo(() => {
		return userRoles.map((role) => ({
			...role,
			label: t(role.label as translationKeys),
		}));
	}, [t]);

	return (
		<>
			<Form.Item
				label={t('First Name')}
				name='firstName'
				rules={[{ required: true, message: t('First name is required!') }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label={t('Last Name')}
				name='lastName'
				rules={[{ required: true, message: t('Last name is required!') }]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label={t('Email Address')}
				name='email'
				rules={[
					{ required: true, message: t('Email address is required!') },
					{ type: 'email', message: t('Email address is invalid!') },
				]}
			>
				<Input />
			</Form.Item>
			<Form.Item
				label={t('Role')}
				name='role'
				rules={[{ required: true, message: t('Role is required!') }]}
			>
				<Select size='large' placeholder={t('Choose a role')}>
					{userRolesWithTranslations.map(({ id, value, label }) => (
						<Select.Option key={id} value={value}>
							{label}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
			<Row gutter={16} align='middle'>
				<Col xs={12}>
					<Button block type='cancel' htmlType='button' onClick={onCancel}>
						{t('Cancel')}
					</Button>
				</Col>
				<Col xs={12}>
					<Button block type='primary' htmlType='submit'>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};
