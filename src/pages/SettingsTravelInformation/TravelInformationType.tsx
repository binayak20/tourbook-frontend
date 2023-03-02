import { SettingsTravelInformationTypeContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TravelInformationType = () => (
	<AccessBoundary to='VIEW_STATION' isDefaultFallback>
		<SettingsTravelInformationTypeContainer />
	</AccessBoundary>
);

export default TravelInformationType;
