export interface IWidgetCofig {
	container: ReactDOM.Container;
	locale: string;
	adminURL: string;
	primaryColor?: string;
	currencyCode?: string;
	redirects?: {
		searchURL: string | boolean;
		bookingURL: string | boolean;
		successURL: string | boolean;
	};
	termsURL?: string;
}

export type IWidgetProps = Pick<
	IWidgetCofig,
	'primaryColor' | 'currencyCode' | 'redirects' | 'termsURL' | 'locale'
>;
