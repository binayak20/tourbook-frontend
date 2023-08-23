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

type ToursHeaderProps = {
	count?: number;
};

export const ToursHeader: FC<ToursHeaderProps> = ({ count }) => {
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);
	const params = new URLSearchParams();

	const handleClick = useCallback(
		({ key }: MenuInfo) => {
			if (key === 'active') {
				params.delete('status');
			} else if (key === 'inactive') {
				params.set('status', 'inactive');
			} else if (key === 'departed') {
				params.set('status', 'departed');
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
				{ key: 'active', label: t('Active Tours') },
				{ key: 'inactive', label: t('Inactive Tours') },
				{ key: 'departed', label: t('Departed Tours') },
				{ key: 'all', label: t('All Tour') },
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
									{t(`${readableText(activeItem)} Tours` as any)} ({count || 0})
								</Typography.Title>
								<DownOutlined />
							</Space>
						</a>
					</Dropdown>
				</Col>

				<Col>
					{isAllowedTo('ADD_TOUR') && (
						<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
							{t('Create tour')}
						</Link>
					)}
				</Col>
			</Row>
			<FilterTable />
		</Fragment>
	);
};
