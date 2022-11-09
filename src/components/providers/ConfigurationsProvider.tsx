import React, { FC, useEffect } from 'react';
import useConfigurations from './useConfigurations';

interface Props {
	loading: React.ReactNode;
	children: React.ReactNode;
}

const ConfigurationsProvider: FC<Props> = ({ loading, children }: Props) => {
	const { data, isLoading } = useConfigurations();

	useEffect(() => {
		if (!data) return;
		document.title = `Tourbooker ${data?.company_name ? '|' : ''} ${data?.company_name || ''}`;
		const favicon: HTMLAnchorElement | null = document.querySelector("link[rel*='icon']");
		if (data?.favicon && favicon) favicon.href = data.favicon;
	}, [data]);

	if (isLoading) return <>{loading}</>;

	return <>{children}</>;
};

export default ConfigurationsProvider;
