import { BookingCreateContainer, BookingV2CreateContainer } from '@/containers';
import { useStoreSelector } from '@/store';
import { AccessBoundary } from 'react-access-boundary';

const BookingCreate = () => {
	const { isBetaMode } = useStoreSelector((state) => state.app);

	return (
		<AccessBoundary to='ADD_BOOKING' isDefaultFallback>
			{isBetaMode ? <BookingV2CreateContainer /> : <BookingCreateContainer />}
		</AccessBoundary>
	);
};

export default BookingCreate;
