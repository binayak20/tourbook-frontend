import { BookingCreateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const BookingCreate = () => (
	<AccessBoundary to='ADD_BOOKING' isDefaultFallback>
		<BookingCreateContainer />
	</AccessBoundary>
);

export default BookingCreate;
