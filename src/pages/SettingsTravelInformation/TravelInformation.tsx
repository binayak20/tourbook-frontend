import { SettingsTravelInformationContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const StationTypes = () => (
	<AccessBoundary to='VIEW_TRAVELINFORMATIONTYPE' isDefaultFallback>
		<SettingsTravelInformationContainer />
	</AccessBoundary>
);

export default StationTypes;
