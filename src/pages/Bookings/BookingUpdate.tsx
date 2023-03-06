import { BookingProvider } from '@/components/providers/BookingProvider';
import { BookingV2UpdateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const BookingUpdate = () => {
	// const { isBetaMode } = useStoreSelector((state) => state.app);

	return (
		<AccessBoundary to='CHANGE_BOOKING' isDefaultFallback>
			<BookingProvider>
				<BookingV2UpdateContainer />
			</BookingProvider>
		</AccessBoundary>
	);
};

export default BookingUpdate;
