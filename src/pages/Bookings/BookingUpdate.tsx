import { BookingProvider } from '@/components/providers/BookingProvider';
import { BookingUpdateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const BookingUpdate = () => (
	<AccessBoundary to='CHANGE_BOOKING' isDefaultFallback>
		<BookingProvider>
			<BookingUpdateContainer />
		</BookingProvider>
	</AccessBoundary>
);

export default BookingUpdate;
