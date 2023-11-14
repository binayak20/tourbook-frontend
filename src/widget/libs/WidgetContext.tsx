import React, { createContext, useContext, useEffect, useState } from 'react';
import { IWidgetCofig } from '../types';
import { currencyFormatter, getStateFromQueryParams, setSearchParams } from './utills';

export type TWidgetState = {
	widget_screen?: 'list' | 'booking' | 'success' | 'error' | null;
	category?: number | null;
	location?: number | null;
	country?: number | null;
	destination?: string | null;
	departure_date?: string | null;
	remaining_capacity?: string | null;
	selected_tour?: string | null;
	page: number;
	limit: number;
};

interface IWidgetContextProps {
	state: TWidgetState;
	updateState: (state: Partial<TWidgetState>, redirectTo?: string) => void;
	formatCurrency: (amount: number) => string;
	redirects?: IWidgetCofig['redirects'];
	termsURL?: string;
	currencyCode?: string;
	locale: string;
}

const WidgetContext = createContext<IWidgetContextProps | undefined>(undefined);

interface WidgetProviderProps {
	children: React.ReactNode;
	locale: string;
	currencyCode?: string;
	redirects?: IWidgetCofig['redirects'];
	termsURL?: string;
}

export function WidgetProvider({
	children,
	locale,
	currencyCode,
	redirects,
	termsURL,
}: WidgetProviderProps) {
	const url = new URL(window.location.href);
	const [state, setState] = useState<TWidgetState>(getStateFromQueryParams(url.searchParams));

	function updateState(state: Partial<TWidgetState>, redirectTo?: string) {
		setState((prevState) => {
			const finalUrl = redirectTo ? new URL(redirectTo) : url;
			const newState = { ...prevState, ...state };
			setSearchParams(newState, finalUrl);
			redirectTo
				? window.location.assign(finalUrl.toString())
				: window.history.pushState(null, '', finalUrl.toString());
			return newState;
		});
	}

	function formatCurrency(amount: number) {
		return currencyFormatter(amount, locale, currencyCode);
	}

	const contextValue: IWidgetContextProps = {
		state,
		updateState,
		formatCurrency,
		redirects,
		termsURL,
		currencyCode,
		locale,
	};

	useEffect(() => {
		const handlePopState = (e: PopStateEvent) => {
			const { searchParams } = new URL((e.currentTarget as Window).location.href);
			setState(getStateFromQueryParams(searchParams));
		};
		window.addEventListener('popstate', handlePopState);
		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, []);

	return <WidgetContext.Provider value={contextValue}>{children}</WidgetContext.Provider>;
}

export function useWidgetState() {
	const context = useContext(WidgetContext);

	if (!context) {
		throw new Error('useWidgetState must be used within a WidgetProvider');
	}

	return context;
}
