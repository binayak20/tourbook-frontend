import { TicketPassengerContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TicketPassenger = () => {
	return (
		<AccessBoundary to='VIEW_TICKET' isDefaultFallback>
			<TicketPassengerContainer />
		</AccessBoundary>
	);
};

export default TicketPassenger;
