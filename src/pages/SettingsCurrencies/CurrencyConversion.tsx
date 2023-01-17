import { SettingsCurrencyConversionContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const CurrencyConversion = () => (
	<AccessBoundary to='VIEW_CURRENCYCONVERSION' isDefaultFallback>
		<SettingsCurrencyConversionContainer />
	</AccessBoundary>
);

export default CurrencyConversion;
