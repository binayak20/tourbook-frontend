import { Layout } from 'antd';
import styled from 'styled-components';

export const LayoutHeaderWrapper = styled(Layout.Header)`
	background: #fff;
	padding: 0 1rem;

	.trigger {
		padding: 0 1rem;
		font-size: 1.5rem;
		line-height: 4rem;
		cursor: pointer;
		transition: color 0.3s;
	}

	.lang-picker {
		margin-top: 0;

		& > .ant-typography {
			display: none;
		}
	}
`;

export const LayoutSiderWrapper = styled(Layout.Sider)`
	background: #fff;
	box-shadow: 5px 8px 24px 5px rgba(208, 216, 243, 0.6);

	.brand-wrapper {
		width: 100%;
		padding: 0 0.5rem;
		margin: 1.5rem 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
`;
