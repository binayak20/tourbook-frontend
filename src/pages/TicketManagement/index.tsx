import { PRIVATE_ROUTES } from '@/routes/paths';
import { Navigate } from 'react-router-dom';

function TicketMangement() {
	return <Navigate to={PRIVATE_ROUTES.TICKETS} replace />;
}

export default TicketMangement;
