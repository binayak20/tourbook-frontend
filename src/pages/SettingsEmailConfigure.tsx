import { SettingsEmailConfigureContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsEmailConfigure = () => (
	<AccessBoundary to='VIEW_EMAILPROVIDERCONFIGURATION' isDefaultFallback>
		<SettingsEmailConfigureContainer />
	</AccessBoundary>
);

export default SettingsEmailConfigure;
