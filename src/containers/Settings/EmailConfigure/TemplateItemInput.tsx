import { EditFilled } from '@ant-design/icons';
import { Button, Col, Form, FormItemProps, Input, Popconfirm, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const TemplateItemInput: FC<FormItemProps> = (props) => {
	const { t } = useTranslation();
	const [isDisabled, setDisabled] = useState(false);
	const form = Form.useFormInstance();

	const value = form.getFieldValue(`${props.name}`);
	console.log('value', value);

	useEffect(() => setDisabled(!!value), [value]);

	return (
		<Row gutter={8} align='middle'>
			<Col span={22}>
				<Form.Item {...props}>
					<Input placeholder={t('Enter template ID')} disabled={isDisabled} />
				</Form.Item>
			</Col>
			<Col span={2}>
				<Popconfirm
					title={t('Do you really want to update?')}
					onConfirm={() => setDisabled(!isDisabled)}
					okText='Yes'
					cancelText='No'
				>
					<Button size='small' type='link' icon={<EditFilled />} />
				</Popconfirm>
			</Col>
		</Row>
	);
};
