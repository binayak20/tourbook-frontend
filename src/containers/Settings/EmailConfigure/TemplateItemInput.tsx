import { Typography } from '@/components/atoms';
import { EditFilled } from '@ant-design/icons';
import { Button, Col, Form, FormItemProps, Input, Popconfirm, Row } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const TemplateItemInput: FC<FormItemProps&{description:string}> = (props) => {
	const { t } = useTranslation();
	const [isDisabled, setDisabled] = useState(false);
	const form = Form.useFormInstance();
	const value = form.getFieldValue(props.name!);

	useEffect(() => setDisabled(!!value), [value]);

	return (
		<Row gutter={8} align='middle'>
			<Col flex='auto'>
				<Form.Item {...props}>
					{props?.description && <Typography.Text type='secondary'>
							{t('Description')} : {props?.description}
						</Typography.Text>}
					<Input placeholder={t('Enter template ID')} disabled={isDisabled} />
				</Form.Item>
			</Col>
			<Col>
				<Popconfirm
					title='Are you sure to update this template?'
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
