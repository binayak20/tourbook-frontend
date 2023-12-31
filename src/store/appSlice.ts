import config from '@/config';
import { Configuration } from '@/libs/api/@types/settings';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Fortnox = Pick<
	Configuration,
	| 'fortnox_client_id'
	| 'fortnox_client_credentials'
	| 'fortnox_scope'
	| 'fortnox_state'
	| 'fortnox_access_type'
	| 'fortnox_response_type'
	| 'fortnox_account_type'
>;

type AppState = {
	isLoaded: boolean;
	routeChange: 'start' | 'complete' | 'error';
	language: 'en' | 'sv';
	currencyID: number;
	primaryColor: string;
	minBookingFee: number;
	secondPaymentFee: number;
	isBetaMode: boolean;
	fortnox: Fortnox | null;
	bankGiro: string | null;
	invoicePaymentDays: number | null;
	darkMode: boolean;
	compactMode: boolean;
};

const initialState: AppState = {
	isLoaded: false,
	routeChange: 'complete',
	language: 'sv',
	currencyID: 2,
	primaryColor: config.themeColorCode,
	minBookingFee: config.minBookingFee,
	secondPaymentFee: config.secondPaymentFee,
	isBetaMode: true,
	fortnox: null,
	bankGiro: null,
	invoicePaymentDays: null,
	darkMode: false,
	compactMode: false,
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
		updateMinBookingFee: (state, action: PayloadAction<AppState['minBookingFee']>) => {
			state.minBookingFee = action.payload == 0 ? config.minBookingFee : action.payload;
		},
		updateSecondPaymentFee: (state, action: PayloadAction<AppState['secondPaymentFee']>) => {
			state.secondPaymentFee = action.payload;
		},
		updateBetaMode: (state, action: PayloadAction<AppState['isBetaMode']>) => {
			state.isBetaMode = action.payload;
		},
		updateFortnox: (state, action: PayloadAction<AppState['fortnox']>) => {
			state.fortnox = action.payload;
		},
		updateBankGiro: (state, action: PayloadAction<AppState['bankGiro']>) => {
			state.bankGiro = action.payload;
		},
		updateInvoicePaymentDays: (state, action: PayloadAction<AppState['invoicePaymentDays']>) => {
			state.invoicePaymentDays = action.payload;
		},
		updateDarkMode: (state, action: PayloadAction<AppState['darkMode']>) => {
			state.darkMode = action.payload;
		},
		updateCompactMode: (state, action: PayloadAction<AppState['compactMode']>) => {
			state.compactMode = action.payload;
		},
	},
});

export default appSlice;
