import { TourDetails } from '@/containers/Tours/TourDetails';
import { AccessBoundary } from 'react-access-boundary';

const TourUpdate = () => (
	<AccessBoundary to='CHANGE_TOUR' isDefaultFallback>
		<TourDetails />
	</AccessBoundary>
);

export default TourUpdate;
