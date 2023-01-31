import { BookingProvider } from '@/components/providers/BookingProvider';
import { BookingUpdateContainer, BookingV2UpdateContainer } from '@/containers';
import { useStoreSelector } from '@/store';
import { AccessBoundary } from 'react-access-boundary';

const BookingUpdate = () => {
	const { isBetaMode } = useStoreSelector((state) => state.app);

	return (
		<AccessBoundary to='CHANGE_BOOKING' isDefaultFallback>
			{isBetaMode ? (
				<BookingProvider>
					<BookingV2UpdateContainer />
				</BookingProvider>
			) : (
				<BookingUpdateContainer />
			)}
		</AccessBoundary>
	);
};

export default BookingUpdate;
