import { SettingsVehicleTypesConainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const VehicleTypes = () => (
	<AccessBoundary to='VIEW_VEHICLETYPE' isDefaultFallback>
		<SettingsVehicleTypesConainer />
	</AccessBoundary>
);

export default VehicleTypes;
