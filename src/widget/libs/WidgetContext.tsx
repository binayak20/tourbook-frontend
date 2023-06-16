import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStateFromQueryParams } from './utills';

export type TWidgetState = {
	widget_screen?: 'list' | 'booking' | null;
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
	updateState: (state: Partial<TWidgetState>) => void;
}

const WidgetContext = createContext<IWidgetContextProps | undefined>(undefined);

interface ThemeProviderProps {
	children: React.ReactNode;
}

export function WidgetProvider({ children }: ThemeProviderProps) {
	const url = new URL(window.location.href);
	const { searchParams } = url;
	const [state, setState] = useState<TWidgetState>(getStateFromQueryParams(searchParams));

	function updateState(state: Partial<TWidgetState>) {
		setState((prevState) => {
			const newState = { ...prevState, ...state };
			Object.keys(newState).forEach((key) => {
				const stateKey = key as keyof typeof newState;
				if (
					newState[stateKey] !== undefined &&
					newState[stateKey] !== null &&
					newState[stateKey] !== ''
				)
					searchParams.set(stateKey, newState[stateKey] as string);
				else searchParams.delete(stateKey);
			});
			window.history.pushState(null, '', url.toString());
			return newState;
		});
	}

	const contextValue: IWidgetContextProps = {
		state,
		updateState,
	};

	useEffect(() => {
		const handlePopState = () => {
			const url = new URL(window.location.href);
			const { searchParams } = url;
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
