/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from '@/components/atoms';
import { logsAPI } from '@/libs/api/logsAPI';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select, Space, message } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC, Fragment, useCallback, useMemo, useState } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

type BookingsHeaderProps = {
	count?: number;
	onSearch: (value: string) => void;
};

export const LogsHeader: FC<BookingsHeaderProps> = ({ onSearch }) => {
	const [eventEmailId, setEventEmailId] = useState('');
	const { Search } = Input;
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(
		() => searchParams.get('status') || searchParams.get('is_departed') || 'booked',
		[searchParams]
	);
	const { data: emailEvents, isLoading } = useQuery(['email-logs'], () => logsAPI.eventEmails());
	console.log(emailEvents);

	const handleClick = useCallback(
		({ key }: MenuInfo) => {
			const params = new URLSearchParams();

			if (key === 'booked') {
				params.delete('status');
				params.delete('is_departed');
			} else if (key === 'cancelled') {
				params.set('status', 'cancelled');
			} else if (key === 'transferred') {
				params.set('status', 'transferred');
			} else if (key === 'departed') {
				params.set('is_departed', 'departed');
			} else {
				params.set('status', 'all');
			}

			navigate({ search: params.toString() });
		},
		[navigate]
	);
	const emailEventOptions = useMemo(() => {
		return (emailEvents?.results || []).map((item) => {
			return { value: item.id.toString(), label: item.name };
		});
	}, [emailEvents]);

	console.log(emailEventOptions);
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
				downloadPDF(data, `email-event-.xlsx`);
			},
			onError: (error: Error) => {
				message.error(error.message);
			},
		}
	);

	const changeEmailEvent = (value: any, record: any) => {
		console.log(value, record);
		setEventEmailId(value);
	};
	return (
		<Fragment>
			<div style={{ marginBottom: 20 }}>
				<Row align='middle' justify='space-between'>
					<Col span={24}>
						<Space>
							<Typography.Title level={4} type='primary' className='margin-0'>
								Logs
							</Typography.Title>
						</Space>
					</Col>
				</Row>
				<Row align='middle' justify='space-between'>
					<Col span={12}>
						<Space>
							<Search
								size='large'
								addonBefore={t('To email')}
								placeholder={t('Search by to email')}
								allowClear
								onSearch={onSearch}
							/>
						</Space>
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
			</div>
		</Fragment>
	);
};
