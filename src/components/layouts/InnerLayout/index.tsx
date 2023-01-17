import { withAuth } from '@/components/hoc';
import { translationKeys } from '@/config/translate/i18next';
import { Breadcrumb, Col, Row } from 'antd';
import { FC, useMemo } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { MenuItem } from './types';

interface InnerLayoutProps {
	MENU_ITEMS: MenuItem[];
	breadcrumbs?: translationKeys[];
}

const InnerLayout: FC<InnerLayoutProps> = ({ MENU_ITEMS, breadcrumbs }) => {
	const { t } = useTranslation();
	const { isAllowedTo } = useAccessContext();

	const isOneOfTheMenuItemsAllowed = useMemo(
		() =>
			MENU_ITEMS.some(({ permission }) => {
				if (!permission) return true;
				return isAllowedTo(permission as string);
			}),
		[MENU_ITEMS, isAllowedTo]
	);

	return (
		<Row gutter={16} style={{ height: '100%' }}>
			{isOneOfTheMenuItemsAllowed && (
				<Col span={6} style={{ height: '100%' }}>
					{breadcrumbs && (
						<Breadcrumb className='margin-4-top margin-4-bottom' separator='>'>
							{breadcrumbs.map((item, index) => (
								<Breadcrumb.Item key={index}>{t(item)}</Breadcrumb.Item>
							))}
						</Breadcrumb>
					)}
					<NavItems>
						{MENU_ITEMS.map(({ name, path, permission }, index) => {
							if (permission && !isAllowedTo(permission as string)) {
								return null;
							}

							return (
								<li key={index}>
									<NavLink to={path}>{t(name)}</NavLink>
								</li>
							);
						})}
					</NavItems>
				</Col>
			)}
			<Col span={isOneOfTheMenuItemsAllowed ? 18 : 24} style={{ height: '100%' }}>
				<Outlet />
			</Col>
		</Row>
	);
};

export default withAuth(InnerLayout);

export const NavItems = styled.ul`
	margin: 0;
	padding: 1rem 0;
	width: 100%;
	list-style: none;
	background: #fff;
	border-radius: 5px;
	border-right: 1px solid rgba(0, 0, 0, 0.06);

	li {
		margin: 0.25rem 0;
		display: inline-block;
		width: 100%;

		a {
			display: block;
			padding: 0.5rem 1rem;
			font-size: 1rem;
			color: var(--ant-text-color);
			border-left: 3px solid transparent;

			&:hover {
				color: var(--ant-primary-color);
			}

			&.active {
				font-weight: 600;
				border-color: var(--ant-primary-color);
				color: var(--ant-primary-color);
				background-color: var(--ant-primary-1);
			}
		}
	}
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

		&.active {
			font-weight: 600;
			color: var(--ant-primary-color);
		}
	}
`;
