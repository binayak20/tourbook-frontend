import { TabPaneProps } from 'antd';

export enum TabsType {
	TOUR_BASICS = 'tour-basics',
	TOUR_DISCOUNT = 'tour-discount',
}

export type Tab = Omit<TabPaneProps, 'tab'> & {
	key: TabsType;
	label: React.ReactNode;
};
