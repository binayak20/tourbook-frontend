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
import { TourTypeFilters } from '../TourTypeFilters';

type TourTypesHeaderProps = {
	count?: number;
};

export const TourTypesHeader: FC<TourTypesHeaderProps> = ({ count }) => {
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const activeItem = useMemo(() => searchParams.get('status') || 'active', [searchParams]);

	const handleClick = useCallback(
		({ key }: MenuInfo) => {
			const params = new URLSearchParams();

			if (key === 'active') {
				params.delete('status');
			} else if (key === 'inactive') {
				params.set('status', 'inactive');
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
				{ key: 'active', label: t('Active tour templates') },
				{ key: 'inactive', label: t('Inactive tour templates') },
				{ key: 'all', label: t('All tour templates') },
			],
			selectedKeys: [activeItem],
			onClick: handleClick,
		};
	}, [activeItem, handleClick, t]);

	return (
		<Fragment>
			<Row align='middle' justify='space-between'>
				<Col span={6}>
					<Dropdown menu={menuItems}>
						<a onClick={(e) => e.preventDefault()}>
							<Space>
								<Typography.Title level={4} type='primary' className='margin-0'>
									{t(`${readableText(activeItem)} tour templates` as any)} ({count || 0})
								</Typography.Title>
								<DownOutlined />
							</Space>
						</a>
					</Dropdown>
				</Col>
				<Col>
					{isAllowedTo('ADD_TOURTYPE') && (
						<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
							{t('Create tour template')}
						</Link>
					)}
				</Col>
			</Row>

			<TourTypeFilters />
		</Fragment>
	);
};
