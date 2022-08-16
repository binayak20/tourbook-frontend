import { Button, Typography } from '@/components/atoms';
import { PlusCircleFilled } from '@ant-design/icons';
import { Checkbox, Col, Form, Modal, Row, Select } from 'antd';
import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const itemOptions = [
	{
		id: 213,
		category: 'Tour',
		subcategory: 'Others',
		name: 'Utombordsmotor',
		active: true,
	},
	{
		id: 212,
		category: 'Tour',
		subcategory: 'Others',
		name: 'Boende på Hotel Brown (två rum)',
		active: true,
	},
	{
		id: 208,
		category: 'Tour',
		subcategory: 'Others',
		name: 'AAvbokning 21-0397',
		active: true,
	},
	{
		id: 207,
		category: 'Tour',
		subcategory: 'Others',
		name: 'Avbokning Tine Bengtsson',
		active: true,
	},
	{
		id: 206,
		category: 'Tour',
		subcategory: 'Others',
		name: 'Avbokning Tine Bengtsson',
		active: true,
	},
	{
		id: 205,
		category: 'Tour',
		subcategory: 'Others',
		name: 'Mantågsnät',
		active: true,
	},
	{
		id: 204,
		category: 'Tour',
		subcategory: 'Others',
		name: '6st extra handdukar',
		active: true,
	},
	{
		id: 203,
		category: 'Tour',
		subcategory: 'Others',
		name: '2st Stand up Paddle board',
		active: true,
	},
	{
		id: 202,
		category: 'Tour',
		subcategory: 'Others',
		name: '2st Stand up Paddle board',
		active: true,
	},
	{
		id: 201,
		category: 'Tour',
		subcategory: 'Others',
		name: 'Avbokning Tine Bengtsson',
		active: true,
	},
];

export const SupplementsPicker = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [items] = useState(itemOptions);
	const { t } = useTranslation();

	return (
		<Fragment>
			<Typography.Title type='primary' level={5}>
				{t('Supplements Included')}
			</Typography.Title>

			<Button
				type='primary'
				size='large'
				icon={<PlusCircleFilled />}
				onClick={() => setIsModalVisible(true)}
			>
				{t('Add supplement')}
			</Button>

			<Modal
				width={765}
				footer={false}
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
			>
				<Typography.Title type='primary' level={4}>
					{t('Add supplement')}
				</Typography.Title>
				<Typography.Paragraph>
					{t('Select the supplement category & sub-category to select the specific item')}
				</Typography.Paragraph>

				<Form size='large' layout='vertical' onFinish={(e) => console.log(e)}>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item
								label={t('Category')}
								name='category'
								rules={[{ required: true, message: t('Category is required!') }]}
							>
								<Select placeholder={t('Please choose an option')} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item
								label={t('Sub-Category')}
								name='sub_category'
								rules={[{ required: true, message: t('Sub-Category is required!') }]}
							>
								<Select placeholder={t('Please choose an option')} />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item label={t('Items')} name='items' valuePropName='checked'>
						<CheckboxGroup options={items.map(({ id, name }) => ({ label: name, value: id }))} />
					</Form.Item>
					<Row gutter={16} justify='center'>
						<Col>
							<Button type='default' style={{ minWidth: 120 }}>
								{t('Cancel')}
							</Button>
						</Col>
						<Col>
							<Button htmlType='submit' type='primary' style={{ minWidth: 120 }}>
								{t('Add')}
							</Button>
						</Col>
					</Row>
				</Form>
			</Modal>
		</Fragment>
	);
};

const CheckboxGroup = styled(Checkbox.Group)`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 16px;

	.ant-checkbox {
		&-group-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 8px 16px;
			border-radius: 4px;
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
