import { Switch as AntSwitch } from 'antd';
import { ComponentProps, FC } from 'react';
import styled from 'styled-components';

type AntSwitchProps = ComponentProps<typeof AntSwitch>;

export type SwitchProps = AntSwitchProps & {
	custom?: boolean;
};

const CustomSwitch = styled(AntSwitch)`
	/* min-width: 4.375rem;
	height: 2.25rem;
	background-color: ${({ theme }) => theme.colorPrimaryBg};
	&-handle {
		width: 1.625rem;
		height: 1.625rem;
		top: calc(50% - 0.8125rem);
		left: 0.3125rem;

		&::before {
			background-color: var(--ant-primary-6);
			border-radius: 100%;
			box-shadow: none;
		}

		&::after {
			content: '';
			width: 0.688rem;
			height: 0.25rem;
			display: block;
			position: absolute;
			top: calc(50% - 0.125rem);
			left: calc(50% - 0.344rem);
			background-image: url('../../../images/icons/switch-dots.svg');
			z-index: 1;
		}
	} */

	&-inner {
		font-size: 0.875rem;
		font-weight: 500;
		color: ${({ theme }) => theme.colorText};
		margin: 0 0.3125rem 0 1.9375rem;
		text-transform: uppercase;
	}
`;

export const Switch: FC<SwitchProps> = ({ custom, ...rest }) => {
	return custom ? <CustomSwitch {...rest} /> : <AntSwitch {...rest} />;
};
