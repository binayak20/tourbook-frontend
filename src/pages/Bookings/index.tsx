import { BookingsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Bookings = () => (
	<AccessBoundary to='VIEW_BOOKING' isDefaultFallback>
		<BookingsContainer />
	</AccessBoundary>
);

export default Bookings;
