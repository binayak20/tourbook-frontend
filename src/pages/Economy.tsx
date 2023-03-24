import { PRIVATE_ROUTES } from '@/routes/paths';
import { Navigate } from 'react-router-dom';

const Settings = () => (
	<Navigate to={`/dashboard/${PRIVATE_ROUTES.ECONOMY}/${PRIVATE_ROUTES.ACCOUNTING_CONFIGURE}`} />
);

export default Settings;
