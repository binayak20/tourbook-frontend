import { SettingsUserRoleUpdateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsUserRoleUpdate = () => (
	<AccessBoundary to='CHANGE_GROUP' isDefaultFallback>
		<SettingsUserRoleUpdateContainer />
	</AccessBoundary>
);

export default SettingsUserRoleUpdate;
