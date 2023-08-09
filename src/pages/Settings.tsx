import { PRIVATE_ROUTES } from '@/routes/paths';
import { Navigate } from 'react-router-dom';

const Settings = () => (
	<Navigate to={`/dashboard/${PRIVATE_ROUTES.SETTINGS}/${PRIVATE_ROUTES.USERS}`} replace />
);

export default Settings;
