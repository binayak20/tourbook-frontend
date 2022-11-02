/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from '@/components/atoms';
import { readableText } from '@/utils/helpers';
import { DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, MenuProps, Row, Space } from 'antd';
import { FC, Fragment, useMemo } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FilterTable } from './FilterTable';

type BookingsHeaderProps = {
	count?: number;
};

export const BookingsHeader: FC<BookingsHeaderProps> = ({ count }) => {
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'booked', [searchParams]);

	const handleClick: MenuProps['onClick'] = ({ key }) => {
		const params = new URLSearchParams();

		if (key === 'booked') {
			params.delete('status');
		} else if (key === 'cancelled') {
			params.set('status', 'cancelled');
		} else if (key === 'transferred') {
			params.set('status', 'transfered');
		} else {
			params.set('status', 'all');
		}

		const searchStr = params.toString();
		navigate(searchStr ? `?${searchStr}` : '');
	};

	const menu = (
		<Menu
			onClick={handleClick}
			selectedKeys={[activeItem]}
			items={[
				{ key: 'booked', label: t('Booked') },
				{ key: 'cancelled', label: t('Cancelled') },
				{ key: 'transferred', label: t('Transferred') },
				{ key: 'all', label: t('All Bookings') },
			]}
		/>
	);

	return (
		<Fragment>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Dropdown overlay={menu}>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								<Typography.Title level={4} type='primary' className='margin-0'>
									{t(`${activeItem === 'all' ? 'All Bookings' : readableText(activeItem)}` as any)}{' '}
									({count || 0})
								</Typography.Title>
								<DownOutlined />
							</Space>
						</a>
					</Dropdown>
				</Col>
				<Col>
					{isAllowedTo('ADD_BOOKING') && (
						<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
							{t('Create booking')}
						</Link>
					)}
				</Col>
			</Row>

			<FilterTable />
		</Fragment>
	);
};
