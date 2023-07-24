import { TicketsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TicketTypes = () => {
	return (
		<AccessBoundary to='VIEW_TICKET' isDefaultFallback>
			<TicketsContainer />
		</AccessBoundary>
	);
};

export default TicketTypes;
