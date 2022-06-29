import { Button as AntButton, ConfigProvider } from 'antd';
import classNames from 'classnames';
import { ComponentProps, FC, useContext } from 'react';

type AntButtonProps = ComponentProps<typeof AntButton>;

export type ButtonProps = Omit<AntButtonProps, 'type'> & {
	type?: AntButtonProps['type'] | 'cancel';
};

export const Button: FC<ButtonProps> = ({ type, className, ...rest }) => {
	const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
	const prefixCls = getPrefixCls('btn');

	return (
		<AntButton
			{...rest}
			className={classNames(
				{
					[`${prefixCls}-${type}`]: type,
				},
				className
			)}
		/>
	);
};