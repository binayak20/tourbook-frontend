import { Brand } from '@/components/atoms';
import { FC } from 'react';
import { LayoutSiderWrapper } from './styles';

type LayoutSiderProps = {
	collapsed?: boolean;
};

export const LayoutSider: FC<LayoutSiderProps> = (props) => (
	<LayoutSiderWrapper {...props}>
		<div className='brand-wrapper'>
			<Brand />
		</div>
	</LayoutSiderWrapper>
);
