import { SettingsLocationsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Locations = () => (
	<AccessBoundary to='VIEW_LOCATION' isDefaultFallback>
		<SettingsLocationsContainer />
	</AccessBoundary>
);

export default Locations;
