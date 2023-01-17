import { SettingsVehiclesConainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Vehicles = () => (
	<AccessBoundary to='VIEW_VEHICLE' isDefaultFallback>
		<SettingsVehiclesConainer />
	</AccessBoundary>
);

export default Vehicles;
