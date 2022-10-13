import { SettingsTerritoriesContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Locations = () => (
	<AccessBoundary to='VIEW_TERRITORY' isDefaultFallback>
		<SettingsTerritoriesContainer />
	</AccessBoundary>
);

export default Locations;
