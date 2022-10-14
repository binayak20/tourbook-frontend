import { SettingsStationTypesContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const StationTypes = () => (
	<AccessBoundary to='VIEW_STATIONTYPE' isDefaultFallback>
		<SettingsStationTypesContainer />
	</AccessBoundary>
);

export default StationTypes;
