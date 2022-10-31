/* eslint-disable @typescript-eslint/no-explicit-any */
import { Typography } from '@/components/atoms';
import { readableText } from '@/utils/helpers';
import { DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, MenuProps, Row, Space } from 'antd';
import { FC, Fragment, useMemo } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

type TourTypesHeaderProps = {
	count?: number;
};

export const TourTypesHeader: FC<TourTypesHeaderProps> = ({ count }) => {
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
				{ key: 'active', label: t('Active Tour Types') },
				{ key: 'inactive', label: t('Inactive Tour Types') },
				{ key: 'all', label: t('All Tour Types') },
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
									{t(`${readableText(activeItem)} Tour Types` as any)} ({count || 0})
								</Typography.Title>
								<DownOutlined />
							</Space>
						</a>
					</Dropdown>
				</Col>
				<Col>
					{isAllowedTo('ADD_TOURTYPE') && (
						<Link className='ant-btn ant-btn-primary ant-btn-lg' to='create'>
							{t('Create tour type')}
						</Link>
					)}
				</Col>
			</Row>
		</Fragment>
	);
};
