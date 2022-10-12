import { BookingUpdateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const BookingUpdate = () => (
	<AccessBoundary to='CHANGE_BOOKING' isDefaultFallback>
		<BookingUpdateContainer />
	</AccessBoundary>
);

export default BookingUpdate;
