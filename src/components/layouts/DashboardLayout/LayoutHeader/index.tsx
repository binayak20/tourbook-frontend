import { LangPicker } from '@/components/atoms';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { createElement, FC } from 'react';
import { LayoutHeaderWrapper } from '../styles';
import { HeaderUserNav } from './HeaderUserNav';

type LayoutHeaderProps = {
	collapsed?: boolean;
	onToggle?: () => void;
};

export const LayoutHeader: FC<LayoutHeaderProps> = ({ collapsed, onToggle }) => (
	<LayoutHeaderWrapper>
		<Row align='middle' justify='space-between'>
			<Col>
				{createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
					className: 'trigger',
					onClick: onToggle,
				})}
			</Col>
			<Col>
				<Row gutter={16}>
					<Col>
						<LangPicker />
					</Col>
					<Col>
						<HeaderUserNav />
					</Col>
				</Row>
			</Col>
		</Row>
	</LayoutHeaderWrapper>
);
