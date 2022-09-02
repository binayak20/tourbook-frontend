import { Typography } from '@/components/atoms';
import { DeleteOutlined, KeyOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, ButtonProps, Card as AntCard, Col, Form, Row, Switch } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export type FormHeaderProps = {
	title: string;
	passwordBtnProps?: ButtonProps;
	primaryBtnProps?: ButtonProps;
	removeBtnProps?: ButtonProps & { isVisble?: boolean };
};

export const FormHeader: FC<FormHeaderProps> = (props) => {
	const {
		title,
		passwordBtnProps,
		primaryBtnProps,
		removeBtnProps: { isVisble: isRemoveBtnVisible = true, ...removeBtnProps } = { isVisble: true },
	} = props;
	const { t } = useTranslation();

	return (
		<Card>
			<Row gutter={16} align='middle' justify='space-between'>
				<Col>
					<Typography.Title
						level={5}
						type='primary'
						style={{ display: 'inline-block', margin: '0 8px 0 0' }}
					>
						{title}
					</Typography.Title>
					<Form.Item name='is_child' valuePropName='checked'>
						<Switch checkedChildren={t('Child')} unCheckedChildren={t('Adult')} />
					</Form.Item>
				</Col>
				<Col>
					<Button size='middle' type='primary' icon={<SwapOutlined />} {...primaryBtnProps}>
						{t('Primary')}
					</Button>
					{isRemoveBtnVisible && (
						<Button
							danger
							size='middle'
							type='primary'
							icon={<DeleteOutlined />}
							{...removeBtnProps}
						>
							{t('Remove')}
						</Button>
					)}
					<Button size='middle' type='default' icon={<KeyOutlined />} {...passwordBtnProps}>
						{t('Generate password')}
					</Button>
				</Col>
			</Row>
		</Card>
	);
};

const Card = styled(AntCard)`
	margin-bottom: 16px;
	background-color: rgb(231, 238, 248);

	.ant {
		&-card-body {
			padding: 16px;
		}

		&-btn {
			margin-left: 8px;
			font-size: 14px;
		}

		&-form-item {
			display: inline-block;
			margin-bottom: 0;

			&-control-input {
				min-height: auto;
			}
		}
	}
`;
