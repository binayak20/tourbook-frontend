import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppState = {
	isLoaded: false,
	routeChange: 'complete',
	language: 'sv',
	currencyID: 2,
	primaryColor: '#20519E',
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
		updatePrimaryColor: (state, action: PayloadAction<AppState['primaryColor']>) => {
			state.primaryColor = action.payload;
		},
	},
});

export default appSlice;

type AppState = {
	isLoaded: boolean;
	routeChange: 'start' | 'complete' | 'error';
	language: 'en' | 'sv';
	currencyID: number;
	primaryColor: string;
};
