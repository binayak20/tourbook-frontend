import styled from 'styled-components';

export const Wrapper = styled.div`
	display: flex;
	height: 100%;
	flex-direction: column;
	gap: 1rem;
`;

export const TableWrapper = styled.div<{ count: number }>`
	max-width: 100%;
	min-height: 1px;
	height: 100%;
	.ant-table-wrapper {
		height: 100%;
		.ant-spin-nested-loading {
			height: 100%;
			.ant-spin-container {
				height: 100%;
				display: flex;
				flex-flow: column nowrap;
				.ant-table {
					flex: auto;
					overflow: hidden;
					.ant-table-container {
						height: 100%;
						display: flex;
						flex-flow: column nowrap;
						.ant-table-header {
							flex: none;
						}
						.ant-table-body {
							flex: auto;
							overflow: auto;
							table {
								height: ${(props) => (!props.count ? '100%' : 'auto')};
							}
						}
					}
				}
				.ant-table-pagination {
					flex: none;
				}
			}
		}
	}
`;
