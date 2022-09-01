import { hexToRGB } from '@/utils/helpers';
import { Button, Checkbox } from 'antd';
import styled from 'styled-components';

export const Wrapper = styled.div`
	width: 100%;
	display: block;
	margin-bottom: 20px;
`;

export const AddBtnWrapper = styled(Button)`
	width: 100%;
	min-height: 80px;
	display: grid;
	align-items: center;
	grid-template-columns: 42px 1fr;
	font-size: 18px;
	text-align: center;
	padding: 12px;
	color: ${({ theme }) => theme.colors.primary};
	border: none;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => hexToRGB(theme.colors.primary, 0.15)};

	&:hover,
	&:active,
	&:focus {
		background-color: ${({ theme }) => hexToRGB(theme.colors.primary, 0.2)};
	}

	.ant {
		&-avatar {
			display: flex;
			align-items: center;
			justify-content: center;
			color: ${({ theme }) => theme.colors.success};
			background-color: ${({ theme }) => theme.colors.white};
		}
	}
`;

export const SupplementWrapper = styled.div`
	width: 100%;
	min-height: 80px;
	display: grid;
	align-items: center;
	grid-template-columns: 60px 1fr 42px;
	gap: 12px;
	font-size: 18px;
	padding: 12px;
	margin-bottom: 16px;
	color: ${({ theme }) => theme.colors.primary};
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => hexToRGB(theme.colors.primary, 0.15)};

	.ant {
		&-avatar {
			display: flex;
			align-items: center;
			justify-content: center;
			color: ${({ theme }) => theme.colors.success};
			background-color: ${({ theme }) => theme.colors.white};
		}

		&-typography {
			margin-bottom: 0;
		}
	}
`;

export const PriceWrapper = styled.div`
	font-size: 14px;
	padding: 6px 12px;
	text-align: center;
	line-height: 20px;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ theme }) => theme.colors.white};
`;

export const CheckboxGroup = styled(Checkbox.Group)`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 16px;

	.ant-checkbox {
		&-group-item {
			display: flex;
			align-items: center;
			padding: 8px 16px;
			border-radius: 4px;
			color: rgba(0, 0, 0, 0.85);
			background-color: rgb(231, 238, 248);
		}

		&-inner {
			height: 1.25rem;
			width: 1.25rem;
			border-radius: 50%;
			border: 1px solid rgb(190, 201, 215);
			background-color: rgb(231, 238, 248);

			&:after {
				left: 28%;
			}
		}

		&-checked {
			&:after {
				border-radius: 50%;
			}

			.ant-checkbox-inner {
				background-color: rgb(15, 85, 190);
			}
		}

		&-wrapper {
			&:hover {
				.ant-checkbox-inner {
					border-color: rgb(15, 85, 190);
				}
			}
		}
	}
`;
