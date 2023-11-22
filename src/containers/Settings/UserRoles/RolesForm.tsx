import { Button, Checkbox, Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { Collapse as AntCollapse, Card, Col, Form, Input, Row } from 'antd';
import { FC, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { useRoleCheck } from './useRoleCheck';

type Props = {
	isLoading?: boolean;
	selectedItems?: number[];
	onPermissionChange?: (permissions: number[]) => void;
	onCancel?: () => void;
	saveButtonText?: string;
};

export const RolesForm: FC<Props> = (props) => {
	const {
		isLoading,
		selectedItems: prevSelectedItems,
		onPermissionChange,
		saveButtonText,
		onCancel,
	} = props;
	const { t } = useTranslation();

	const { data } = useQuery(['contentPermissions'], () => settingsAPI.contentPermissions());

	const allPermissions = useMemo(
		() => data?.map(({ permissions }) => permissions.map(({ id }) => id)).flat() || [],
		[data]
	);

	const { isAllChecked, isIndeterminate, selectedItems, handleCheckAllChange, handleCheckChange } =
		useRoleCheck({
			permissions: allPermissions,
			preSelectedItems: prevSelectedItems,
			onCallback: onPermissionChange,
		});

	const activeKeys = useMemo(() => {
		if (data?.length === 1) return `${data[0].id}`;
		if (data && data?.length > 1) return [`${data[0].id}`, `${data[1].id}`];
		return '';
	}, [data]);

	return (
		<>
			<Row gutter={12} align='middle' justify='space-between'>
				<Col md={{ span: 12 }}>
					<Form.Item
						label={t('Role Name')}
						name='name'
						rules={[{ required: true, message: t('Role is required!') }]}
					>
						<Input />
					</Form.Item>
				</Col>
				<Col>
					<Checkbox
						custom
						indeterminate={isIndeterminate}
						checked={isAllChecked}
						onChange={handleCheckAllChange}
					>
						<Typography.Text>{t('Mark all')}</Typography.Text>
					</Checkbox>
				</Col>
			</Row>

			<Typography.Title level={5} type='primary' noMargin>
				{t('Permissions')}
			</Typography.Title>

			{data && data?.length > 0 && (
				<Collapse expandIconPosition='end' defaultActiveKey={activeKeys}>
					{data.map(({ id, model_name, permissions }) => {
						const isGroupChecked = permissions.every((item) => selectedItems?.includes(item.id));
						const isGroupIndeterminate =
							permissions.some((item) => selectedItems?.includes(item.id)) &&
							!permissions.every((item) => selectedItems?.includes(item.id));

						return (
							<Collapse.Panel
								key={id}
								header={
									<Fragment>
										<Checkbox
											custom
											onClick={(e) => e.stopPropagation()}
											indeterminate={isGroupIndeterminate}
											checked={isGroupChecked}
											onChange={(e) =>
												handleCheckChange(
													e,
													permissions.map(({ id }) => id)
												)
											}
										/>
										<Typography.Text style={{ marginLeft: 8 }}>
											{model_name} [
											{permissions.filter((item) => selectedItems?.includes(item.id)).length}/
											{permissions.length}]
										</Typography.Text>
									</Fragment>
								}
							>
								{permissions.map(({ id: permissionId, name }) => {
									const isChecked = selectedItems?.includes(permissionId);

									return (
										<CheckboxWrapper key={permissionId}>
											<Row gutter={16}>
												<Col flex='auto'>
													<Typography.Text>{name}</Typography.Text>
												</Col>
												<Col flex='none'>
													<Checkbox
														custom
														checked={isChecked}
														onChange={(e) => handleCheckChange(e, permissionId)}
													/>
												</Col>
											</Row>
										</CheckboxWrapper>
									);
								})}
							</Collapse.Panel>
						);
					})}
				</Collapse>
			)}

			<Row gutter={16} align='middle'>
				<Col xs={24} md={6}>
					<Button block type='cancel' htmlType='button' onClick={onCancel}>
						{t('Cancel')}
					</Button>
				</Col>
				<Col xs={24} md={6}>
					<Button block type='primary' htmlType='submit' loading={isLoading}>
						{saveButtonText ? saveButtonText : t('Save')}
					</Button>
				</Col>
			</Row>
		</>
	);
};

const Collapse = styled(AntCollapse)`
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

const CheckboxWrapper = styled(Card)`
	background-color: ${({ theme }) => theme.colorPrimaryBg};

	& + & {
		margin-top: 1rem;
	}

	.ant {
		&-card {
			&-body {
				padding: 0.75rem 1rem;
			}
		}

		&-typography {
			color: ${({ theme }) => theme.colorPrimary};
		}
	}
`;
