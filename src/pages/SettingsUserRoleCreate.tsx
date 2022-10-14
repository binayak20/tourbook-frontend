import { SettingsUserRoleCreateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsUserRoleCreate = () => (
	<AccessBoundary to='ADD_GROUP' isDefaultFallback>
		<SettingsUserRoleCreateContainer />
	</AccessBoundary>
);

export default SettingsUserRoleCreate;
