import { Button, Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { readableText } from '@/utils/helpers';
import { Card, Col, Collapse, Form, Input, Row } from 'antd';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { PermissionMemo } from './Permission';

type Props = {
	isLoading?: boolean;
	selectedItems?: number[];
	onItemChange?: (item: API.Permission) => void;
	onCancel?: () => void;
	saveButtonText?: string;
};

export const RolesForm: FC<Props> = (props) => {
	const { isLoading, selectedItems, onItemChange, saveButtonText, onCancel } = props;
	const { t } = useTranslation();

	const { data, isLoading: permissionsLoading } = useQuery(['contentPermissions'], () =>
		settingsAPI.contentPermissions()
	);

	const items = useMemo(() => {
		if (data?.length) {
			return data.map(({ id, app_label, permissions }) => ({
				id,
				app_label: readableText(app_label),
				permissions,
			}));
		}

		return [];
	}, [data]);

	const activeKeys = useMemo(() => {
		if (items?.length === 1) return `${items[0].id}`;
		if (items?.length > 1) return [`${items[0].id}`, `${items[1].id}`];
		return '';
	}, [items]);

	return (
		<>
			<Row>
				<Col md={{ span: 12 }}>
					<Form.Item
						label={t('Role Name')}
						name='name'
						rules={[{ required: true, message: t('Role is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
			</Row>

			<Typography.Title level={5} type='primary' noMargin>
				{t('Permissions')}
			</Typography.Title>
			<Card loading={permissionsLoading} bordered={false} bodyStyle={{ padding: 0 }}>
				{items?.length > 0 && (
					<Permissions defaultActiveKey={activeKeys} expandIconPosition='right'>
						{items.map(({ id, app_label, permissions }) => (
							<Collapse.Panel
								key={id}
								header={
									<PermissionHeader
										app_label={app_label}
										permissions={permissions}
										selectedItems={selectedItems}
									/>
								}
							>
								{permissions.map(({ id: permissionId, name, codename }) => (
									<PermissionMemo
										key={permissionId}
										title={name}
										name={codename}
										checked={selectedItems?.includes(permissionId)}
										onChange={() => onItemChange?.({ id: permissionId, name, codename })}
									/>
								))}
							</Collapse.Panel>
						))}
					</Permissions>
				)}
			</Card>
			<Row gutter={16} align='middle' justify='center' className='margin-4'>
				<Col span={3}>
					<Button block type='cancel' htmlType='button' onClick={onCancel}>
						{t('Cancel')}
					</Button>
				</Col>
				<Col span={3}>
					<Button block type='primary' htmlType='submit' loading={isLoading}>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};

type PermissionHeaderProps = {
	app_label: string;
	permissions: API.Permission[];
	selectedItems: number[] | undefined;
};
const PermissionHeader: FC<PermissionHeaderProps> = ({ app_label, permissions, selectedItems }) => {
	const numberOfSelectedItems = permissions?.filter(({ id }) => selectedItems?.includes(id)).length;
	return (
		<Row gutter={10}>
			<Col>{app_label}</Col>
			<Col>
				[{numberOfSelectedItems}/{permissions.length}]
			</Col>
		</Row>
	);
};

const Permissions = styled(Collapse)`
	&.ant-collapse {
		border: none;
		background-color: transparent;
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr 1fr;
		margin-bottom: 1rem;

		.ant-collapse {
			&-header {
				font-size: 1rem;
				font-weight: 600;
				color: ${({ theme }) => theme.colors.text};
				padding-left: 0;
				padding-right: 0;
				text-transform: uppercase;
			}

			&-item {
				border: none;
			}

			&-content-box {
				padding-left: 0;
				padding-right: 0;
			}
		}
	}
`;
