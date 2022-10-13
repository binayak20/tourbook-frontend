import { SettingsStationsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Stations = () => (
	<AccessBoundary to='VIEW_STATION' isDefaultFallback>
		<SettingsStationsContainer />
	</AccessBoundary>
);

export default Stations;
