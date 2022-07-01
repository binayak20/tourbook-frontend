import { translationKeys } from '@/config/translate/i18next';
import { routeNavigate } from '@/routes/utils';
import { Col, Row } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Typography } from '../atoms';

export const NavItems = styled.ul`
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
`;
export const NavItem = styled.li`
	display: block;
	margin: 0.25rem 0;
	padding: 0.25rem 0;
	&:first-child {
		margin-top: 0;
	}
	&:last-child {
		margin-bottom: 0;
	}
	a {
		font-size: 1.1rem;
		color: ${({ theme }) => theme.colors.text};
		&.active {
			font-weight: 600;
			color: ${({ theme }) => theme.colors.primary};
		}
	}
`;

type SettingsMenuItem = {
	name: translationKeys;
	path: string;
};

const SETTINGS_MENU_ITEMS: SettingsMenuItem[] = [
	{
		name: 'Users List',
		path: routeNavigate(['SETTINGS', 'USERS_LIST']),
	},
	{
		name: 'User Roles',
		path: routeNavigate(['SETTINGS', 'USER_ROLES']),
	},
	{
		name: 'Categories',
		path: routeNavigate(['SETTINGS', 'CATEGORIES']),
	},
	{
		name: 'Locations',
		path: routeNavigate(['SETTINGS', 'LOCATIONS']),
	},
	{
		name: 'Airports',
		path: routeNavigate(['SETTINGS', 'AIRPORTS']),
	},
];

export const SettingsLayout: FC = () => {
	const { t } = useTranslation();
	return (
		<Row>
			<Col span={4}>
				<Col span={24} className='margin-4-bottom'>
					<Row align='middle'>
						<Col span={24}>
							<Typography.Title level={4} type='primary' className='margin-0'>
								{t('Settings')}
							</Typography.Title>
						</Col>
					</Row>
				</Col>
				<NavItems>
					{SETTINGS_MENU_ITEMS.map(({ name, path }, index) => (
						<NavItem key={index}>
							<NavLink to={path}>{name}</NavLink>
						</NavItem>
					))}
				</NavItems>
			</Col>
			<Col span={20}>
				<Outlet />
			</Col>
		</Row>
	);
};
