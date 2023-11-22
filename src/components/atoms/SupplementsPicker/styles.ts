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
	color: ${(props) => props.theme.colorPrimary};
	border: none;
	border-radius: 10px;
	border: 1px solid ${(props) => props.theme.colorPrimaryBgHover};
	background-color: ${(props) => props.theme.colorPrimaryBg};

	&:hover,
	&:active,
	&:focus {
		background-color: ${(props) => props.theme.colorPrimaryBgHover};
	}

	.ant {
		&-avatar {
			display: flex;
			align-items: center;
			justify-content: center;
			color: ${(props) => props.theme.colorSuccess};
			background-color: ${(props) => props.theme.colorBgContainer};
		}
	}
`;

export const SupplementWrapper = styled.div<{ editPrice: boolean }>`
	width: 100%;
	min-height: 80px;
	display: grid;
	align-items: center;
	transition: all 0.25s;
	grid-template-columns: ${(props) => (props?.editPrice ? '1fr 1fr' : '60px 1fr 120px')};
	grid-column: 1/-1;
	gap: 8px;
	font-size: 18px;
	padding: 12px;
	margin-bottom: 16px;
	color: ${(props) => props.theme.colorPrimary};
	border-radius: 10px;
	border: 1px solid ${(props) => props.theme.colorPrimaryBgHover};
	background-color: ${(props) => props.theme.colorPrimaryBg};

	.ant {
		&-avatar {
			display: flex;
			align-items: center;
			justify-content: center;
			color: ${(props) => props.theme.colorSuccess};
			background-color: ${(props) => props.theme.colorBgElevated};
		}

		&-typography {
			margin-bottom: 0;
		}
	}
`;

export const PriceWrapper = styled.div<{ editPrice: boolean }>`
	position: relative;
	font-size: 14px;
	padding: 6px 12px;
	text-align: center;
	line-height: 20px;
	border-radius: 10px;
	background-color: ${(props) => props.theme.colorBgContainer};
	grid-column: ${(props) => (props?.editPrice ? 'span 2' : '')};
	.overlay {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		background-color: ${(props) => props.theme.colorBgElevated};
		opacity: 0;
		transition: all 0.25s;
		&:hover {
			opacity: 1;
		}
	}
`;
export const EditPrice = styled.div`
	display: flex;
	align-items: center;
	gap: 0.4rem;
	.ant-input-number {
		width: 100%;
		input {
			text-align: right;
		}
	}
`;

export const CheckboxGroup = styled(Checkbox.Group)`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 16px;

	.ant-checkbox {
		top: 0;

		&-group-item {
			width: 100%;
			display: flex;
			align-items: center;
			padding: 16px;
			margin: 0;
			color: ${(props) => props.theme.colorTextSecondary};
			border-radius: 10px;
			border: 1px solid ${(props) => props.theme.colorPrimaryBgHover};
			background-color: ${(props) => props.theme.colorPrimaryBg};
			&:has(Button) {
				padding: 0;
				Button {
					width: 100%;
					text-align: left;
				}
				.ant-checkbox {
					display: none;
				}
				.ant-checkbox + span {
					width: 100%;
				}
			}
		}

		&-inner {
			height: 1.25rem;
			width: 1.25rem;
			border-radius: 50%;
			border: 1px solid rgb(190, 201, 215);
			background-color: ${(props) => props.theme.colorPrimaryBg};

			&:after {
				left: 28%;
			}
		}

		&-checked {
			&:after {
				border-radius: 50%;
			}

			.ant-checkbox-inner {
				background-color: ${(props) => props.theme.colorPrimary};
			}
		}

		&-wrapper {
			&:hover {
				.ant-checkbox-inner {
					border-color: ${(props) => props.theme.colorPrimary};
				}
			}
		}
	}
`;

export const QuantityWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 30px;

	.ant {
		&-btn {
			min-width: 26px;
			height: 30px;
			padding: 0;
			border: 0;
			border-radius: 0;
			box-shadow: none;
		}

		&-typography {
			min-width: 28px;
			text-align: center;
			font-size: 14px;
			font-weight: 500;
		}
	}
`;
