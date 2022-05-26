import { ConfigProvider, Switch as AtnSwitch } from 'antd';
import classNames from 'classnames';
import { ComponentProps, FC, useContext } from 'react';

type AntSwitchProps = ComponentProps<typeof AtnSwitch>;

export type SwitchProps = AntSwitchProps & {
	custom?: boolean;
};

export const Switch: FC<SwitchProps> = ({ className, custom, ...rest }) => {
	const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
	const prefixCls = getPrefixCls('switch');

	return (
		<AtnSwitch
			{...rest}
			className={classNames(
				{
					[`${prefixCls}-custom`]: custom,
				},
				className
			)}
		/>
	);
};
