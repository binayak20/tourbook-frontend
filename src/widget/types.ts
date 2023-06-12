export interface WidgetCofig {
	container: ReactDOM.Container;
	locale: 'en' | 'sv';
	adminURL: string;
	primaryColor: string;
	currency: {
		locale: string;
		value: string;
	};
}
