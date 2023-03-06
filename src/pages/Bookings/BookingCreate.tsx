import { BookingV2CreateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const BookingCreate = () => {
	// const { isBetaMode } = useStoreSelector((state) => state.app);

	return (
		<AccessBoundary to='ADD_BOOKING' isDefaultFallback>
			<BookingV2CreateContainer />
		</AccessBoundary>
	);
};

export default BookingCreate;
