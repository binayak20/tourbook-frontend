import { PRIVATE_ROUTES } from '@/routes/paths';
import { Navigate } from 'react-router-dom';

const ToursAdministration = () => (
	<Navigate to={`/dashboard/${PRIVATE_ROUTES.TOURS_TYPES}`} replace />
);

export default ToursAdministration;
