import { Col, Row } from 'antd';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';

export const SettingsLayout: FC = () => (
	<Row>
		<Col span={6}>menus</Col>
		<Col span={18}>
			<Outlet />
		</Col>
	</Row>
);
