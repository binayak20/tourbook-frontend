import { SettingsCurrenciesContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Currencies = () => (
	<AccessBoundary to='VIEW_CURRENCY' isDefaultFallback>
		<SettingsCurrenciesContainer />
	</AccessBoundary>
);

export default Currencies;
