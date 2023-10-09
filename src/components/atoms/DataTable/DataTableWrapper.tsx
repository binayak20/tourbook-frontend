import { DownOutlined } from '@ant-design/icons';
import { Col, Dropdown, MenuProps, Row, Space } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC, ReactNode, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '../Typography';
import { TableWrapper, Wrapper } from './styles';

export const DataTableWrapper: FC<{
	children: ReactNode;
	title?: string;
	count?: number;
	filterBar?: ReactNode;
	menuOptions?: {
		key: string;
		label: string;
		queryKey?: string;
	}[];
	activeItem?: string;
	createButton?: ReactNode;
}> = ({ children, title, count, filterBar, menuOptions, activeItem, createButton }) => {
	const navigate = useNavigate();
	const handleClick = useCallback(
		({ key }: MenuInfo) => {
			const params = new URLSearchParams();
			const activeOption = menuOptions?.find((item) => item.key === key);
			if (activeOption?.queryKey) params.set(activeOption.queryKey, activeOption.key);
			navigate({ search: params.toString() });
		},
		[navigate, menuOptions]
	);
	const menuItems: MenuProps = useMemo(() => {
		return {
			items: menuOptions?.map((item) => ({
				key: item.key,
				label: item.label,
			})),
			selectedKeys: [activeItem as string],
			onClick: handleClick,
		};
	}, [menuOptions, activeItem, handleClick]);

	return (
		<Wrapper>
			<Row align='middle' justify='space-between'>
				<Col span={12}>
					{title && !menuOptions?.length ? (
						<Typography.Title level={4} type='primary' noMargin>
							{`${title} (${count || 0})`}
						</Typography.Title>
					) : null}
					{menuOptions?.length ? (
						<Dropdown menu={menuItems}>
							<a onClick={(e) => e.preventDefault()}>
								<Space>
									<Typography.Title level={4} type='primary' className='margin-0'>
										{`${menuOptions?.find((item) => item.key === activeItem)?.label} (${
											count || 0
										})`}
									</Typography.Title>
									<DownOutlined />
								</Space>
							</a>
						</Dropdown>
					) : null}
				</Col>
				{createButton ? <Col>{createButton}</Col> : null}
			</Row>
			{filterBar}
			<TableWrapper count={count || 0}>{children}</TableWrapper>
		</Wrapper>
	);
};
