import { TicketsContainer } from '@/containers';
import { FC } from 'react';

const Tickets: FC = () => (
	// <AccessBoundary to='TICKETS' isDefaultFallback>
	<TicketsContainer />
	// </AccessBoundary>
);

export default Tickets;
