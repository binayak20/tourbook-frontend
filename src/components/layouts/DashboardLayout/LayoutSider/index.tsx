import { Brand } from '@/components/atoms';
import { FC } from 'react';
import { LayoutSiderWrapper } from '../styles';
import { NavItems } from './NavItems';

type LayoutSiderProps = {
	collapsed?: boolean;
};

export const LayoutSider: FC<LayoutSiderProps> = (props) => (
	<LayoutSiderWrapper className='shadow' width={240} {...props}>
		<div className='brand-wrapper'>
			<Brand />
		</div>
		<NavItems />
	</LayoutSiderWrapper>
);
