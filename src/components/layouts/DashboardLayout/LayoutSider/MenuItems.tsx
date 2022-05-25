import { CaretDownOutlined } from '@ant-design/icons';
import { FC, HTMLAttributes } from 'react';
import { NavLink } from 'react-router-dom';
import { NavItem, NavItems } from '../styles';
import { MenuItem, MENU_ITEMS } from './constants';

type MenuItemsRenderProps = {
	items: MenuItem[];
} & HTMLAttributes<HTMLUListElement>;

const MenuItemsRender: FC<MenuItemsRenderProps> = ({ items, ...rest }) => {
	if (items?.length === 0) {
		return null;
	}

	return (
		<NavItems {...rest}>
			{items.map(({ name, path, ItemIcon, childrens }, index) => (
				<NavItem key={index}>
					<NavLink to={path} end={!childrens?.length}>
						{ItemIcon && <ItemIcon />}
						<span className='nav-text'>{name}</span>
						{childrens?.length && <CaretDownOutlined className='arrow' />}
					</NavLink>
					{childrens && <MenuItemsRender items={childrens} />}
				</NavItem>
			))}
		</NavItems>
	);
};

export const MenuItems = () => <MenuItemsRender items={MENU_ITEMS} />;
