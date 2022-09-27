import { Button, Typography } from '@/components/atoms';
import { fortnoxAPI } from '@/libs/api';
import { FortnoxAccounts } from '@/libs/api/@types';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { groupBy } from '@/utils/helpers';
import { Col, Modal, Row, Select } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { AccountsByEvent } from './AccountsByEvent';
import { AccountsData } from './types';

export const SettingsAccountingConfigureCreate = () => {
	const { t } = useTranslation();
	const [isModalVisible, setModalVisible] = useState(false);
	const [selectedRow, setSelectedRow] = useState<AccountsData>();
	const [newSelectedEvent, setNewSelectedEvent] = useState<number>();
	const [highlightEventId, setHighlightEventId] = useState<number>();
	const [showAddNew, setShowAddNew] = useState(false);

	const { data, isFetching: isAccountsFetching } = useQuery('fornoxAccounts', () =>
		fortnoxAPI.fortnoxAccounts(DEFAULT_LIST_PARAMS)
	);

	const { data: fortnoxEvents } = useQuery('fortnoxEvents', () =>
		fortnoxAPI.events(DEFAULT_LIST_PARAMS)
	);

	const { data: fortnoxScenarios, isLoading: scenariosLoading } = useQuery('fortnoxScenarios', () =>
		fortnoxAPI.scenarios(DEFAULT_LIST_PARAMS)
	);

	const groupedByEvents = useMemo(
		() => groupBy(data?.results || [], (entry) => entry?.fortnox_event?.id?.toString()),
		[data?.results]
	);

	const handleAddNewEvent = () => {
		if (Object.keys(groupedByEvents).includes(newSelectedEvent?.toString() || '')) {
			document.getElementById(`event-${newSelectedEvent}`)?.scrollIntoView();
			setHighlightEventId(newSelectedEvent);
		} else {
			setSelectedRow({ fortnox_event: newSelectedEvent });
			setShowAddNew(true);
		}
		setModalVisible(false);
	};

	return (
		<Row gutter={[8, 8]}>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle' justify='space-between'>
					<Col>
						<Typography.Title level={4} type='primary' className='margin-0'>
							{t('Accounting Services')}
						</Typography.Title>
					</Col>
					<Col>
						<Button type='primary' size='large' onClick={() => setModalVisible(true)}>
							{t('Add new event')}
						</Button>
						<Modal
							okButtonProps={{ size: 'large' }}
							okText={t('Create')}
							cancelButtonProps={{ size: 'large' }}
							centered
							maskClosable={false}
							title={t('Add accounts in new event')}
							visible={isModalVisible}
							onCancel={() => setModalVisible(false)}
							onOk={handleAddNewEvent}
						>
							<Row gutter={[16, 0]} align='middle' justify='start'>
								<Col span={4}>{`${t('Event')}: `}</Col>
								<Col span={20}>
									<Select
										size='large'
										style={{ width: '100%' }}
										placeholder='Select an event'
										onChange={setNewSelectedEvent}
										value={newSelectedEvent}
										options={fortnoxEvents?.results?.map((fortnoxEvent) => ({
											label: fortnoxEvent?.name,
											value: fortnoxEvent?.id,
										}))}
									/>
								</Col>
							</Row>
						</Modal>
					</Col>
				</Row>
			</Col>
			{showAddNew && newSelectedEvent === selectedRow?.fortnox_event && (
				<Col span={24} style={{ paddingBottom: '2rem' }}>
					<AccountsByEvent
						fortnoxScenarios={fortnoxScenarios?.results}
						accountsData={
							[
								{
									fortnox_event: fortnoxEvents?.results?.find((e) => e?.id === newSelectedEvent),
								},
							] as FortnoxAccounts[]
						}
						selectedRow={selectedRow}
						setSelectedRow={setSelectedRow}
						isLoading={scenariosLoading}
					/>
				</Col>
			)}

			{Object.entries(groupedByEvents).map(([eventId, data]) => (
				<Col
					span={24}
					id={`event-${eventId}`}
					className='alerts-border'
					key={eventId}
					style={{ paddingBottom: '2rem' }}
				>
					<AccountsByEvent
						fortnoxScenarios={fortnoxScenarios?.results}
						accountsData={data}
						selectedRow={selectedRow}
						setSelectedRow={setSelectedRow}
						isLoading={isAccountsFetching}
						highlight={!!(highlightEventId?.toString() === eventId)}
						hideNewEvent={() => setShowAddNew(false)}
					/>
				</Col>
			))}
		</Row>
	);
};
