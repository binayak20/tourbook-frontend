import { useStoreSelector } from '@/store';
import { CaretDownOutlined } from '@ant-design/icons';
import { Tag, Tooltip } from 'antd';
import { forwardRef, HTMLAttributes, useCallback, useEffect, useRef } from 'react';
import { useAccessContext } from 'react-access-boundary';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { NavItem, NavItems } from '../styles';
import { MenuItem, MENU_ITEMS } from './constants';

type MenuItemsRenderProps = {
	items: MenuItem[];
} & HTMLAttributes<HTMLUListElement>;

const MenuItemsRender = forwardRef<HTMLUListElement, MenuItemsRenderProps>(
	({ items, ...rest }, ref) => {
		const { t } = useTranslation();
		const { isAllowedTo } = useAccessContext();
		const { isBetaMode } = useStoreSelector((state) => state.app);

		const isAllowedPermission = useCallback(
			(permission: string | string[]) => {
				if (Array.isArray(permission)) {
					for (const item of permission) {
						return isAllowedTo(item);
					}

					return false;
				}

				return isAllowedTo(permission);
			},
			[isAllowedTo]
		);

		const nextAvailableItem = useCallback(
			(items?: MenuItem[]) => {
				if (!items?.length) {
					return null;
				}

				for (const item of items) {
					if (!item?.permission) {
						return item;
					}

					if (isAllowedPermission(item.permission)) {
						return item;
					}
				}

				return null;
			},
			[isAllowedPermission]
		);

		if (items?.length === 0) {
			return null;
		}

		return (
			<NavItems ref={ref} {...rest}>
				{items.map(({ name, path, end, ItemIcon, childrens, permission, beta }, index) => {
					const nextItem = nextAvailableItem(childrens);

					if (permission && !isAllowedPermission(permission)) {
						return null;
					}

					if (childrens?.length && !nextItem) {
						return null;
					}

					return (
						<NavItem key={index}>
							<Tooltip title={t(name)} placement='right'>
								<NavLink to={path} end={end}>
									{ItemIcon && <ItemIcon />}
									<NavTextWrapper>
										<span className='nav-text'>{t(name)}</span>
										{isBetaMode && beta && <BetaTag color='#f50'>Beta</BetaTag>}
									</NavTextWrapper>
									{childrens?.length && <CaretDownOutlined className='arrow' />}
								</NavLink>
							</Tooltip>
							{childrens && <MenuItemsRender items={childrens} />}
						</NavItem>
					);
				})}
			</NavItems>
		);
	}
);

export const MenuItems = () => {
	const wrapperRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (!wrapperRef.current) {
			return;
		}

		const activeElements = wrapperRef.current.querySelectorAll('.active');
		if (activeElements.length) {
			activeElements.forEach((element) => {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'center',
				});
			});
		}
	}, []);

	return <MenuItemsRender ref={wrapperRef} items={MENU_ITEMS} />;
};

const NavTextWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const BetaTag = styled(Tag)`
	font-weight: normal;
	margin-right: 0;
	height: 18px;
	line-height: 16px;
	border-radius: 3px;
`;
