import { Button, Checkbox, Typography } from '@/components/atoms';
import { settingsAPI } from '@/libs/api';
import { Card, Col, Collapse as AntCollapse, Form, Input, Row } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { FC, Fragment, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import styled from 'styled-components';

type Props = {
	isLoading?: boolean;
	selectedItems?: number[];
	onPermissionChange?: (permissions: number[]) => void;
	onCancel?: () => void;
	saveButtonText?: string;
};

export const RolesForm: FC<Props> = (props) => {
	const { isLoading, selectedItems = [], onPermissionChange, saveButtonText, onCancel } = props;
	const { t } = useTranslation();

	const { data } = useQuery(['contentPermissions'], () => settingsAPI.contentPermissions());

	const handlePermissionChange = useCallback(
		(e: CheckboxChangeEvent) => {
			const { value, checked } = e.target;
			const newPermissions = new Set(selectedItems);

			if (checked) {
				if (Array.isArray(value)) {
					value.forEach((v) => newPermissions.add(v));
				} else {
					newPermissions.add(value);
				}
			} else if (Array.isArray(value)) {
				value.forEach((item) => {
					newPermissions.delete(item);
				});
			} else {
				newPermissions.delete(value);
			}

			onPermissionChange?.([...newPermissions]);
		},
		[onPermissionChange, selectedItems]
	);

	const allPermissions = useMemo(
		() => data?.map(({ permissions }) => permissions.map(({ id }) => id)).flat() || [],
		[data]
	);

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
						value={allPermissions}
						indeterminate={
							selectedItems?.length > 0 && selectedItems?.length < allPermissions?.length
						}
						checked={selectedItems?.length === allPermissions?.length}
						onChange={handlePermissionChange}
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
						return (
							<Collapse.Panel
								key={id}
								header={
									<Fragment>
										<Checkbox
											custom
											onClick={(e) => e.stopPropagation()}
											value={permissions.map((item) => item.id)}
											indeterminate={
												permissions.some((item) => selectedItems?.includes(item.id)) &&
												!permissions.every((item) => selectedItems?.includes(item.id))
											}
											checked={permissions.every((item) => selectedItems?.includes(item.id))}
											onChange={handlePermissionChange}
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
									return (
										<CheckboxWrapper key={permissionId}>
											<Row gutter={16}>
												<Col flex='auto'>
													<Typography.Text>{name}</Typography.Text>
												</Col>
												<Col flex='none'>
													<Checkbox
														custom
														value={permissionId}
														checked={selectedItems?.includes(permissionId)}
														onChange={handlePermissionChange}
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
	background-color: #f8f8f9;

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
			color: var(--ant-primary-color);
		}
	}
`;
