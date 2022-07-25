import { Checkbox } from '@/components/atoms';
import { Card, CheckboxProps, Col, Row, Typography } from 'antd';
import { FC, memo } from 'react';
import styled from 'styled-components';

type PermissionProps = {
	title: string;
} & CheckboxProps;

export const Permission: FC<PermissionProps> = ({ title, ...rest }) => (
	<PermissionWrapper>
		<Row gutter={16}>
			<Col flex='auto'>
				<Typography.Text>{title}</Typography.Text>
			</Col>
			<Col flex='none'>
				<Checkbox custom {...rest} />
			</Col>
		</Row>
	</PermissionWrapper>
);

export const PermissionMemo = memo(Permission);

const PermissionWrapper = styled(Card)`
	background-color: #f8f8f9;

	& + & {
		margin-top: 1rem;
	}

	.ant {
		&-card {
			&-body {
				padding: 0.75rem 1rem;
			}
		}

		&-typography {
			color: ${({ theme }) => theme.colors.primary};
		}
	}
`;
