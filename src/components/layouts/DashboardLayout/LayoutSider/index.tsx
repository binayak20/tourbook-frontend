import { Brand } from '@/components/atoms';
import { useStoreSelector } from '@/store';
import { FC, HTMLAttributes } from 'react';
import { LayoutSiderWrapper, NavItemsWrapper } from '../styles';
import { MenuItems } from './MenuItems';

type LayoutSiderProps = {
	collapsed?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const LayoutSider: FC<LayoutSiderProps> = (props) => {
	const { compactMode } = useStoreSelector((state) => state.app);
	return (
		<LayoutSiderWrapper
			{...props}
			width={compactMode ? 210 : 240}
			theme={'light' as any}
			className='shadow'
		>
			<div className='brand-wrapper'>
				<Brand />
			</div>
			<NavItemsWrapper>
				<MenuItems />
			</NavItemsWrapper>
		</LayoutSiderWrapper>
	);
};
