import { useStoreSelector } from '@/store';
import { ConfigProvider, GlobalToken, ThemeConfig, theme } from 'antd';
import React, { FC, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import useConfigurations from './useConfigurations';

interface Props {
	loading: React.ReactNode;
	children: React.ReactNode;
}

const ConfigurationsProvider: FC<Props> = ({ loading, children }: Props) => {
	const { data, isLoading } = useConfigurations();
	const { primaryColor, darkMode, compactMode } = useStoreSelector((state) => state.app);
	const algorithm = [darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm];

	const themeConfig: ThemeConfig = {
		algorithm: compactMode ? [...algorithm, theme.compactAlgorithm] : algorithm,
		token: {
			colorPrimary: primaryColor,
			colorLink: primaryColor,
			fontFamily: 'Cera Pro',
		},
	};

	const globalToken = primaryColor ? theme.getDesignToken(themeConfig) : ({} as GlobalToken);

	useEffect(() => {
		if (!data) return;
		document.title = `Booking System ${data?.company_name ? '|' : ''} ${data?.company_name || ''}`;
		const favicon: HTMLAnchorElement | null = document.querySelector("link[rel*='icon']");
		if (data?.favicon && favicon) favicon.href = data.favicon;
	}, [data]);

	if (isLoading) return <>{loading}</>;

	return (
		<ConfigProvider theme={themeConfig}>
			<ThemeProvider theme={globalToken}>{children}</ThemeProvider>
		</ConfigProvider>
	);
};

export default ConfigurationsProvider;
