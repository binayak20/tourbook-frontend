import { Typography } from '@/components/atoms';
import { readableText } from '@/utils/helpers';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Space } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type HeaderProps = {
	count?: number;
	activeItem?: string;
	sideItem?: string;
};

export const HeaderDropdown: FC<HeaderProps> = ({ count, activeItem, sideItem }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleClick = useCallback(
		({ key }: MenuInfo) => {
			const params = new URLSearchParams();
			console.log(params);
			if (key === 'active') {
				params.delete('status');
			} else if (key === 'inactive') {
				params.set('status', 'inactive');
			} else {
				params.set('status', 'all');
			}

			navigate({ search: params.toString() });
		},
		[navigate]
	);
	const menuItems: MenuProps = useMemo(() => {
		return {
			items: [
				{ key: 'active', label: t(`Active ${sideItem}`) },
				{ key: 'inactive', label: t(`Inactive ${sideItem}`) },
				{ key: 'all', label: t(`All ${sideItem}`) },
			],
			selectedKeys: [activeItem ?? ''],
			onClick: handleClick,
		};
	}, [activeItem, handleClick, t, sideItem]);
	return (
		<Dropdown menu={menuItems}>
			<a onClick={(e) => e.preventDefault()}>
				<Space>
					<Typography.Title level={4} type='primary' className='margin-0'>
						{t(`${readableText(activeItem ?? '')} ${sideItem}` as any)} ({count || 0})
					</Typography.Title>
					<DownOutlined />
				</Space>
			</a>
		</Dropdown>
	);
};
