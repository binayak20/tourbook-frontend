import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppState = {
	isLoaded: false,
	routeChange: 'complete',
	language: 'en',
	currencyID: 2,
};

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		completeLoader: (state) => {
			state.isLoaded = true;
		},
		updateRoute: (state, action: PayloadAction<AppState['routeChange']>) => {
			state.routeChange = action.payload;
		},
		updateLanguage: (state, action: PayloadAction<AppState['language']>) => {
			state.language = action.payload;
		},
		updateCurrency: (state, action: PayloadAction<AppState['currencyID']>) => {
			state.currencyID = action.payload;
		},
	},
});

export default appSlice;

type AppState = {
	isLoaded: boolean;
	routeChange: 'start' | 'complete' | 'error';
	language: 'en' | 'sv';
	currencyID: number;
};
