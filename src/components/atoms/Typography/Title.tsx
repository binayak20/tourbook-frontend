import { ConfigProvider, Typography } from 'antd';
import { BaseType } from 'antd/lib/typography/Base';
import classNames from 'classnames';
import { ComponentProps, FC, useContext } from 'react';

type AntTitle = ComponentProps<typeof Typography.Title>;

export type TitleProps = Omit<AntTitle, 'type'> & {
	type?: BaseType | 'primary' | 'white';
	noMargin?: boolean;
};

export const Title: FC<TitleProps> = ({ type, noMargin, className, ...rest }) => {
	const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
	const prefixCls = getPrefixCls('typography');

	return (
		<Typography.Title
			{...rest}
			className={classNames(
				{
					[`${prefixCls}-${type}`]: type,
					[`${prefixCls}-no-margin`]: noMargin,
				},
				className
			)}
		/>
	);
};
