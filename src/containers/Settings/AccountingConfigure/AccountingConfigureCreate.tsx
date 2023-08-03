import { Typography } from '@/components/atoms';
import { fortnoxAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { groupBy } from '@/utils/helpers';
import { Col, Row } from 'antd';
import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { AccountsByEvent } from './AccountsByEvent';
import { AccountsData } from './types';

export const SettingsAccountingConfigureCreate = () => {
	const [selectedRow, setSelectedRow] = useState<AccountsData>();

	const { data, isFetching: isAccountsFetching } = useQuery('fornoxAccounts', () =>
		fortnoxAPI.fortnoxAccounts(DEFAULT_LIST_PARAMS)
	);

	const { data: fortnoxScenarios } = useQuery('fortnoxScenarios', () =>
		fortnoxAPI.scenarios(DEFAULT_LIST_PARAMS)
	);

	const groupedByEvents = useMemo(
		() => groupBy(data?.results || [], (entry) => entry?.fortnox_event?.id?.toString()),
		[data?.results]
	);

	return (
		<Row gutter={[8, 8]}>
			<Col span={24} className='margin-4-bottom'>
				<Row align='middle' justify='space-between'>
					<Col>
						<Typography.Title level={4} type='primary' className='margin-0'>
							Fortnox
						</Typography.Title>
					</Col>
				</Row>
			</Col>

			{Object.entries(groupedByEvents)
				.sort(([_, dataA], [__, dataB]) =>
					dataA?.[0]?.fortnox_event.name.localeCompare(dataB?.[0]?.fortnox_event.name)
				)
				.map(([eventId, data]) => (
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
						/>
					</Col>
				))}
		</Row>
	);
};
