import { SettingsAccommodationsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsAccommodations = () => (
	<AccessBoundary to='VIEW_ACCOMMODATION' isDefaultFallback>
		<SettingsAccommodationsContainer />
	</AccessBoundary>
);

export default SettingsAccommodations;
