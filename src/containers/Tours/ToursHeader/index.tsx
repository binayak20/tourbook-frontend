import { Typography } from '@/components/atoms';
import { DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, MenuProps, Row, Space } from 'antd';
import { FC, Fragment, useMemo } from 'react';
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

	const handleClick: MenuProps['onClick'] = ({ key }) => {
		const params = new URLSearchParams();

		if (key === 'active') {
			params.delete('status');
		} else if (key === 'inactive') {
			params.set('status', 'inactive');
		} else if (key === 'departed') {
			params.set('status', 'departed');
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
				{ key: 'active', label: t('Active Tours') },
				{ key: 'inactive', label: t('Inactive Tours') },
				{ key: 'departed', label: t('Departed Tours') },
				{ key: 'all', label: t('All Tours') },
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
									{t(
										`${
											activeItem === 'active'
												? 'Active'
												: activeItem === 'inactive'
												? 'Inactive'
												: activeItem === 'departed'
												? 'Departed'
												: 'All'
										} Tours`
									)}{' '}
									({count || 0})
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
