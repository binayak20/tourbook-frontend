/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from '@/components/atoms';
import { logsAPI } from '@/libs/api';
import { DEFAULT_LIST_PARAMS } from '@/utils/constants';
import { selectFilterBy } from '@/utils/helpers';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Row, Select, Space, message } from 'antd';
import { FC, Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import SearchComponent, { Field } from '../../../../components/SearchComponent';

type BookingsHeaderProps = {
	count?: number;
	onSearchEventFilter: (value: string) => void;
};

export const LogsHeader: FC<BookingsHeaderProps> = ({ onSearchEventFilter }) => {
	const [eventEmailId, setEventEmailId] = useState('');
	const [eventEmailLabel, seteventEmailLabel] = useState('');
	const { t } = useTranslation();

	const { data: emailEvents, isLoading } = useQuery(['email-logs'], () =>
		logsAPI.eventEmails(DEFAULT_LIST_PARAMS)
	);

	const emailEventOptions = useMemo(() => {
		return (emailEvents?.results || []).map((item) => {
			return { value: item.id.toString(), label: item.name };
		});
	}, [emailEvents]);

	const downloadPDF = (data: Blob, filename: string) => {
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(data);
		link.download = filename;
		document.body.append(link);
		link.click();
		link.remove();
	};

	const { mutate: mutateDownloadInvoice, isLoading: isDownloadLoading } = useMutation(
		(eventEmailId: string) => logsAPI.downloadEventEmail(eventEmailId),
		{
			onSuccess: (data) => {
				downloadPDF(data, `email-event-${eventEmailLabel}.xlsx`);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const changeEmailEvent = (value: any, record: any) => {
		seteventEmailLabel(record?.label);
		setEventEmailId(value);
		onSearchEventFilter(record?.label);
	};
	const searchFields: Field[] = [
		{
			type: 'input',
			name: 'to_email',
			param: 'to_email',
			defaultValue: undefined,
			placeholder: t('Search by to email'),
		},
	];
	return (
		<Fragment>
			<>
				<Row align='middle' justify='space-between'>
					<Col span={24}>
						<Space>
							<Typography.Title level={4} type='primary' className='margin-0'>
								{t('Email Logs')}
							</Typography.Title>
						</Space>
					</Col>
				</Row>
				<Row align='middle' justify='space-between'>
					<Col span={12}>
						<SearchComponent fields={searchFields} />
					</Col>
					<Col span={12} style={{ right: 25, position: 'absolute' }}>
						<Space>
							<Select
								style={{ width: 300 }}
								size='large'
								allowClear
								options={emailEventOptions}
								placeholder={t('Email events')}
								onChange={(e, record) => changeEmailEvent(e, record)}
								loading={isLoading}
								showSearch
								optionFilterProp='children'
								filterOption={selectFilterBy}
							/>
							<Button
								loading={isDownloadLoading}
								disabled={!eventEmailId}
								onClick={() => mutateDownloadInvoice(eventEmailId)}
								size='large'
								ghost
								type='primary'
							>
								<DownloadOutlined />
							</Button>
						</Space>
					</Col>
				</Row>
			</>
		</Fragment>
	);
};
