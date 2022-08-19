import { Checkbox } from 'antd';
import styled from 'styled-components';

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

export const SupplementListWrapper = styled.div`
	width: 100%;
	margin: 16px 0;
	display: block;

	.ant {
		&-btn-primary {
			width: 100%;
			height: 80px;
			font-size: 19px;
			margin: 8px 0;
			display: grid;
			color: ${({ theme }) => theme.colors.primary};
			background: rgb(231, 238, 248);
			border: rgb(231, 238, 248);
			grid-template-columns: 42px 1fr;
			align-items: center;
			text-align: left;

			.anticon {
				font-size: 28px;
				line-height: 0;

				&-delete {
					position: absolute;
					right: 15px;
					color: #ffa39e;
				}
			}
		}
	}
`;
