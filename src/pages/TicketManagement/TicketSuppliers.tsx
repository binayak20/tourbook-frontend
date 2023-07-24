import { TicketSuppliersContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TicketTypes = () => {
	return (
		<AccessBoundary to='VIEW_TICKETSUPPLIER' isDefaultFallback>
			<TicketSuppliersContainer />
		</AccessBoundary>
	);
};

export default TicketTypes;
