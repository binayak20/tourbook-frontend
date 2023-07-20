import { TicketTypesContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TicketTypes = () => {
	return (
		<AccessBoundary to='VIEW_TICKETTYPE' isDefaultFallback>
			<TicketTypesContainer />
		</AccessBoundary>
	);
};

export default TicketTypes;
