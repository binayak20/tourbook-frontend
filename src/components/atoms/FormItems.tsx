import { DatePicker, Select } from 'antd';
import { tint } from 'polished';
import styled from 'styled-components';

const { RangePicker } = DatePicker;

export const OutlinedRangePicker = styled(RangePicker)`
	&&& {
		background: none;
		border: 1px solid ${(props) => tint(0.7, props.theme.colors.primary)};
		input {
			background: none;
			&::placeholder {
				color: ${(props) => tint(0.3, props.theme.colors.primary)};
			}
		}
	}
`;

export const OutlinedSelect = styled(Select)`
	&&& {
		.ant-select-selector {
			background: none;
			border: 1px solid ${(props) => tint(0.7, props.theme.colors.primary)};
		}
		.ant-select-selection-placeholder {
			color: ${(props) => tint(0.3, props.theme.colors.primary)};
			opacity: 1;
		}
	}
`;
