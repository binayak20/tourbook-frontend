import { Button, Typography } from '@/components/atoms';
import { StatusColumn } from '@/components/StatusColumn';
import { fortnoxAPI } from '@/libs/api';
import { FortnoxAccountPayload, FortnoxAccounts, FortnoxScenario } from '@/libs/api/@types';
import {
	CloseCircleOutlined,
	EditOutlined,
	PlusCircleOutlined,
	SaveOutlined,
} from '@ant-design/icons';
import { Col, Input, message, Row, Select, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { AccountsData } from './types';

interface Props {
	accountsData: FortnoxAccounts[];
	selectedRow?: AccountsData;
	setSelectedRow: Dispatch<SetStateAction<AccountsData | undefined>>;
	fortnoxScenarios?: FortnoxScenario[];
	isLoading?: boolean;
	highlight?: boolean;
	hideNewEvent?: () => void;
}

export const AccountsByEvent: FC<Props> = ({
	accountsData,
	selectedRow,
	setSelectedRow,
	fortnoxScenarios,
	isLoading,
	highlight,
	hideNewEvent,
}) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [accountsDataTable, setAccountsDataTable] = useState<AccountsData[]>([]);
	const { mutate: handleSubmit, isLoading: isSaving } = useMutation(
		(id?: number) =>
			id
				? fortnoxAPI.updateFortnoxAccount(id, selectedRow as FortnoxAccountPayload)
				: fortnoxAPI.createFortnoxAccount(selectedRow as FortnoxAccountPayload),
		{
			onSuccess: () => {
				queryClient.invalidateQueries('fornoxAccounts');
				message.success(
					t(`Account has been ${selectedRow?.id ? 'updated' : 'added'} for the event`)
				);
				setSelectedRow({});
				trimUnfinishedNewRow();
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const trimUnfinishedNewRow = () => {
		setAccountsDataTable((current) => current.filter((entry) => entry?.id));
	};

	const isEntryRowAlive = useMemo(
		() => !!accountsDataTable?.find((entry) => entry?.id === undefined),
		[accountsDataTable]
	);

	const handleAddAccount = () => {
		hideNewEvent?.();
		setSelectedRow({ fortnox_event: accountsDataTable[0]?.fortnox_event });
		setAccountsDataTable((current) => [{ key: 'new' }, ...current]);
	};

	useEffect(() => {
		const dataParsedForTable: AccountsData[] = (accountsData || [])?.map((entry) => ({
			key: entry?.id?.toString() || 'new',
			id: entry?.id,
			fortnox_event: entry.fortnox_event?.id,
			fortnox_scenario: entry.fortnox_scenario?.id,
			type: entry?.type,
			account_number: entry?.account_number,
			is_active: entry?.is_active,
		}));
		setAccountsDataTable(dataParsedForTable);
	}, [accountsData]);

	useEffect(() => {
		if (
			selectedRow?.id ||
			(accountsData && selectedRow?.fortnox_event !== accountsData[0]?.fortnox_event?.id)
		)
			trimUnfinishedNewRow();
	}, [accountsData, selectedRow]);

	const typeOptions = [
		{
			value: 'debit',
			label: 'Debit',
		},
		{
			value: 'credit',
			label: 'Credit',
		},
	];

	const columns: ColumnsType<AccountsData> = [
		{
			title: t('Scenario'),
			dataIndex: 'fortnox_scenario',
			width: 200,
			render: (value, record) =>
				selectedRow?.id === record?.id ? (
					<Select
						style={{ width: '100%' }}
						value={selectedRow?.fortnox_scenario}
						onChange={(selected) =>
							setSelectedRow((currentRow) => ({ ...currentRow, fortnox_scenario: selected }))
						}
						placeholder='Select a scenario'
						options={fortnoxScenarios?.map((fortnoxScenario) => ({
							value: fortnoxScenario.id,
							label: fortnoxScenario.name,
						}))}
					/>
				) : (
					fortnoxScenarios?.find((e) => e.id === value)?.name
				),
		},
		{
			title: t('Type'),
			dataIndex: 'type',
			width: 200,
			render: (value, record) =>
				selectedRow?.id === record?.id ? (
					<Select
						style={{ width: '100%' }}
						value={selectedRow?.type}
						onChange={(selected) =>
							setSelectedRow((currentRow) => ({ ...currentRow, type: selected }))
						}
						placeholder='Select a scenario'
						options={typeOptions}
					/>
				) : value === 'debit' ? (
					'Debit'
				) : (
					'Credit'
				),
		},
		{
			title: t('Account'),
			width: 200,
			dataIndex: 'account_number',
			render: (value, record) =>
				selectedRow?.id === record?.id ? (
					<Input
						value={selectedRow?.account_number}
						onChange={(e) =>
							setSelectedRow((currentRow) => ({
								...currentRow,
								account_number: e.target.value,
							}))
						}
					/>
				) : (
					value
				),
		},
		{
			title: t('Status'),
			dataIndex: 'is_active',
			width: 200,
			render: (_, record) => {
				return (
					record?.id && (
						<StatusColumn
							status={!!record?.is_active}
							id={record.id}
							endpoint={'fortnox-accounts'}
							onSuccessFn={() => {
								queryClient.invalidateQueries('fortnoxAccounts');
							}}
						/>
					)
				);
			},
		},
		{
			title: t('Actions'),
			dataIndex: 'id',
			width: 100,
			align: 'right',
			render: (_, record) => (
				<div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
					{selectedRow?.id !== record?.id ? (
						<Button
							icon={<EditOutlined />}
							onClick={() => {
								hideNewEvent?.();
								trimUnfinishedNewRow();
								setSelectedRow(record);
							}}
						>
							Edit
						</Button>
					) : (
						<Button
							icon={<SaveOutlined />}
							loading={isSaving}
							type='primary'
							onClick={() => handleSubmit(record?.id)}
						>
							Save
						</Button>
					)}
					{record?.id === undefined && (
						<Button
							onClick={() => {
								trimUnfinishedNewRow();
								setSelectedRow({});
							}}
							danger
							icon={<CloseCircleOutlined />}
						/>
					)}
				</div>
			),
		},
	];

	return (
		<Row gutter={[4, 8]}>
			<Col span={24} style={{ paddingLeft: '0.4rem' }}>
				<Row justify='space-between' align='middle'>
					<Row gutter={[8, 8]}>
						<Col>
							<Typography.Title level={5} type='secondary'>
								Event:
							</Typography.Title>
						</Col>
						<Col>
							<Typography.Title level={5} type='primary'>
								{accountsData && accountsData[0].fortnox_event.name}
							</Typography.Title>
						</Col>
					</Row>
					<Col>
						<Button
							icon={<PlusCircleOutlined />}
							type='dashed'
							style={{ height: '2.2rem' }}
							onClick={handleAddAccount}
							disabled={isEntryRowAlive}
						>
							Add Account
						</Button>
					</Col>
				</Row>
			</Col>
			<BorderCol $highlight={highlight} span={24}>
				<Table
					loading={isLoading}
					rowKey={'key'}
					dataSource={accountsDataTable}
					pagination={false}
					columns={columns}
				/>
			</BorderCol>
		</Row>
	);
};

const BorderCol = styled(Col)<{ $highlight?: boolean }>`
	border-radius: 0.25rem;
	box-shadow: ${(props) =>
		props?.$highlight ? `0 0 0.15rem ${props?.theme?.colors?.primary}` : ''};
`;
