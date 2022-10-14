import { SettingsCountriesContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Locations = () => (
	<AccessBoundary to='VIEW_COUNTRY' isDefaultFallback>
		<SettingsCountriesContainer />
	</AccessBoundary>
);

export default Locations;
