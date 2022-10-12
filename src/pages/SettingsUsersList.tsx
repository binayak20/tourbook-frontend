import { SettingsUsersListContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const SettingsProfile = () => (
	<AccessBoundary to='VIEW_USER' isDefaultFallback>
		<SettingsUsersListContainer />
	</AccessBoundary>
);

export default SettingsProfile;
