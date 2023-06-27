import { Button, Typography } from '@/components/atoms';
import { fortnoxAPI } from '@/libs/api';
import { FortnoxAccountPayload, FortnoxAccounts, FortnoxScenario } from '@/libs/api/@types';
import { CloseCircleOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Col, Empty, Input, message, Row, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
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

	const columns: ColumnsType<AccountsData> = [
		{
			title: t('Scenario'),
			dataIndex: 'fortnox_scenario',
			width: 200,
			render: (value) => fortnoxScenarios?.find((e) => e.id === value)?.name,
		},
		{
			title: t('Type'),
			dataIndex: 'type',
			width: 200,
			render: (value) => (value === 'debit' ? 'Debit' : 'Credit'),
		},
		{
			title: t('Account'),
			width: 200,
			dataIndex: 'account_number',
			render: (value, record) =>{
				if(record?.is_active===false){
					return <Typography.Text type='danger'>{ t('Account is inactive')} </Typography.Text>
				}
				return selectedRow?.id === record?.id ? (
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
				)
			}
				,
		},
		{
			title: t('Actions'),
			dataIndex: 'id',
			width: 100,
			align: 'right',
			render: (_, record) => {
				return (
					<div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
						{selectedRow?.id !== record?.id ? (
							<Button
							disabled={record?.is_active===false}
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
							<>
								<Button
									icon={<SaveOutlined />}
									loading={isSaving}
									type='primary'
									onClick={() => handleSubmit(record?.id)}
								>
									Save
								</Button>
								<Button
									onClick={() => {
										trimUnfinishedNewRow();
										setSelectedRow({});
									}}
									danger
									icon={<CloseCircleOutlined />}
								/>
							</>
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
				);
			},
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
				</Row>
			</Col>
			<BorderCol $highlight={highlight} span={24}>
				<Table
					locale={{
						emptyText: (
							<Empty
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description={<span>{t('No results found')}</span>}
							/>
						),
					}}
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
