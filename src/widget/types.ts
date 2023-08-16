export interface IWidgetCofig {
	container: ReactDOM.Container;
	locale: 'en' | 'sv';
	adminURL: string;
	primaryColor?: string;
	currency?: {
		locale: string;
		value: string;
	};
	redirects?: {
		searchURL: string | boolean;
		bookingURL: string | boolean;
		successURL: string | boolean;
	};
}

export type IWidgetProps = Pick<IWidgetCofig, 'primaryColor' | 'currency' | 'redirects'>;
