/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from '@/components/atoms';
import { readableText } from '@/utils/helpers';
import { DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, MenuProps, Row, Space } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC, Fragment, useCallback, useMemo } from 'react';
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
	const activeItem = useMemo(
		() => searchParams.get('status') || searchParams.get('is_departed') || 'booked',
		[searchParams]
	);

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

	const menuItems: MenuProps = useMemo(() => {
		return {
			items: [
				{ key: 'booked', label: t('Booked') },
				{ key: 'cancelled', label: t('Cancelled') },
				{ key: 'transferred', label: t('Transferred') },
				{ key: 'departed', label: t('Departed') },
				{ key: 'all', label: t('All Bookings') },
			],
			selectedKeys: [activeItem],
			onClick: handleClick,
		};
	}, [activeItem, handleClick, t]);

	return (
		<Fragment>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					<Dropdown menu={menuItems}>
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
