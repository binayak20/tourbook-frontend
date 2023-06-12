import React, { createContext, useContext, useState } from 'react';
import config from '../config';

export type TWidgetState = {
	widget_screen?: 'list' | 'booking' | null;
	category?: number | null;
	location?: number | null;
	country?: number | null;
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
	const url = new URL(window.location as unknown as string);
	const { searchParams } = url;
	const [state, setState] = useState<TWidgetState>({
		widget_screen: searchParams.get('widget_screen') as TWidgetState['widget_screen'],
		category: Number(searchParams.get('category')) || null,
		location: Number(searchParams.get('location')) || null,
		country: Number(searchParams.get('country')) || null,
		departure_date: searchParams.get('departure_date'),
		remaining_capacity: searchParams.get('remaining_capacity'),
		selected_tour: searchParams.get('selected_tour'),
		page: Number(searchParams.get('page')) || 1,
		limit: Number(searchParams.get('limit')) || config.ITEMS_PER_PAGE,
	});

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

	return <WidgetContext.Provider value={contextValue}>{children}</WidgetContext.Provider>;
}

export function useWidgetState() {
	const context = useContext(WidgetContext);

	if (!context) {
		throw new Error('useWidgetState must be used within a WidgetProvider');
	}

	return context;
}
