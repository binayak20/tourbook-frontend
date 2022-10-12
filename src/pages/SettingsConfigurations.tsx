import { SettingsConfigurationsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsConfigurations = () => (
	<AccessBoundary to='VIEW_CONFIGURATION' isDefaultFallback>
		<SettingsConfigurationsContainer />
	</AccessBoundary>
);

export default SettingsConfigurations;
