import { hexToRGB } from '@/utils/helpers';
import { Layout } from 'antd';
import styled from 'styled-components';

export const LayoutHeaderWrapper = styled(Layout.Header)`
	background: ${({ theme }) => theme.colors.white};
	padding: 0 1rem;

	.trigger {
		padding: 0 1rem;
		font-size: 1.25rem;
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

	.ant-dropdown-trigger {
		display: block;
	}
`;

export const LayoutSiderWrapper = styled(Layout.Sider)`
	background: ${({ theme }) => theme.colors.white};

	.brand-wrapper {
		width: 100%;
		padding: 0 0.5rem;
		margin: 1.5rem 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ant-menu {
		&:not(.ant-menu-horizontal) .ant-menu-item-selected {
			font-weight: 600;
			background-color: ${({ theme }) => hexToRGB(theme.colors.primary, 0.1)};
		}

		&-title-content {
			font-size: 1rem;
		}

		&-item {
			width: 90%;
			height: 3.25rem;
			border-top-right-radius: 20rem;
			border-bottom-right-radius: 20rem;

			&::after {
				right: inherit;
				left: 0;
			}

			&-icon {
				font-size: 1.25rem;
			}
		}

		&-inline {
			&-collapsed {
				& > .ant-menu {
					&-item {
						padding-left: 1rem;
						padding-right: 1rem;
						text-align: center;
					}

					&-submenu {
						.ant-menu-submenu-title {
							padding-left: 1rem;
							padding-right: 1rem;
							text-align: center;
						}
					}

					&-item .ant-menu-item-icon,
					&-submenu > .ant-menu-submenu-title .ant-menu-item-icon {
						display: block;
						height: 100%;
						margin: 0 auto;
					}

					&-submenu {
						width: 90%;

						.ant-menu-submenu-title {
							height: 3.25rem;
							margin-top: 0;
							margin-bottom: 0;
							border-top-right-radius: 20rem;
							border-bottom-right-radius: 20rem;
						}

						&-selected {
							.ant-menu-submenu-title {
								font-weight: 600;
								background-color: ${({ theme }) => hexToRGB(theme.colors.primary, 0.1)};
							}
						}
					}
				}
			}

			.ant-menu-submenu {
				&:not(:last-child) {
					margin-bottom: 0.5rem;
				}

				&-title {
					width: 90%;
					height: 3.25rem;
					margin-top: 0;
					margin-bottom: 0;
					border-top-right-radius: 20rem;
					border-bottom-right-radius: 20rem;
				}

				&-selected {
					.ant-menu-submenu-title {
						font-weight: 600;
						background-color: ${({ theme }) => hexToRGB(theme.colors.primary, 0.1)};
					}
				}
			}
		}

		&-sub {
			width: calc(100% - 2rem);
			margin-left: 2rem;

			.ant-menu-item {
				margin-left: -1px;
				padding-left: 1rem !important;
			}

			&.ant-menu-inline {
				border-left: 1px solid rgb(190, 201, 215);
				background-color: ${({ theme }) => theme.colors.white};
			}

			&-selected {
				font-weight: 600;
			}
		}
	}
`;
