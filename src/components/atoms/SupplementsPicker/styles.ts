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
	color: var(--ant-primary-color);
	border: none;
	border-radius: 10px;
	border: 1px solid var(--ant-primary-2);
	background-color: var(--ant-primary-1);

	&:hover,
	&:active,
	&:focus {
		background-color: var(--ant-primary-2);
	}

	.ant {
		&-avatar {
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--ant-success-color);
			background-color: #fff;
		}
	}
`;

export const SupplementWrapper = styled.div`
	width: 100%;
	min-height: 80px;
	display: grid;
	align-items: center;
	grid-template-columns: 60px 1fr 80px;
	gap: 8px;
	font-size: 18px;
	padding: 12px;
	margin-bottom: 16px;
	color: var(--ant-primary-color);
	border-radius: 10px;
	border: 1px solid var(--ant-primary-2);
	background-color: var(--ant-primary-1);

	.ant {
		&-avatar {
			display: flex;
			align-items: center;
			justify-content: center;
			color: var(--ant-success-color);
			background-color: #fff;
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
	border-radius: 10px;
	background-color: #fff;
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
			color: rgba(0, 0, 0, 0.85);
			border-radius: 10px;
			border: 1px solid var(--ant-primary-2);
			background-color: var(--ant-primary-1);
		}

		&-inner {
			height: 1.25rem;
			width: 1.25rem;
			border-radius: 50%;
			border: 1px solid rgb(190, 201, 215);
			background-color: var(--ant-primary-1);

			&:after {
				left: 28%;
			}
		}

		&-checked {
			&:after {
				border-radius: 50%;
			}

			.ant-checkbox-inner {
				background-color: var(--ant-primary-color);
			}
		}

		&-wrapper {
			&:hover {
				.ant-checkbox-inner {
					border-color: var(--ant-primary-color);
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
