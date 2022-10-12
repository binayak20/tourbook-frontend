import { SettingsUserRolesContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsUserRoles = () => (
	<AccessBoundary to='VIEW_GROUP' isDefaultFallback>
		<SettingsUserRolesContainer />
	</AccessBoundary>
);

export default SettingsUserRoles;
