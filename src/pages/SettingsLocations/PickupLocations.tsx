import { SettingsPickupLocationsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const PickupLocations = () => (
	<AccessBoundary to='VIEW_PICKUPLOCATION' isDefaultFallback>
		<SettingsPickupLocationsContainer />
	</AccessBoundary>
);

export default PickupLocations;
