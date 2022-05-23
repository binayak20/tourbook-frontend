import loginBG from '@/assets/images/login-bg.webp';
import { withoutAuth } from '@/components/hoc';
import { Col, Row } from 'antd';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Brand, LangPicker } from '../atoms';

export const SignInLayout: FC = withoutAuth(() => (
	<RowWrapper align='middle' justify='center'>
		<LangPicker />
		<Col xs={0} lg={12}>
			<BGWithImage />
		</Col>
		<Col xs={24} lg={12}>
			<LoginWrapper>
				<Brand />
				<Outlet />
			</LoginWrapper>
		</Col>
	</RowWrapper>
));

const RowWrapper = styled(Row)`
	min-height: 100vh;
	position: relative;

	.lang-picker {
		position: absolute;
		right: 1rem;
		top: 1rem;
		z-index: 999;

		& > .ant-typography {
			display: none;
		}
	}
`;

const BGWithImage = styled.div`
	width: 100%;
	min-height: 100vh;
	background-image: ${`url(${loginBG})`};
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
`;

const LoginWrapper = styled.div`
	max-width: 24rem;
	margin: 0 auto;
	padding: 1rem 1rem 1.5rem;
`;
