import { TourCreateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TourUpdate = () => (
	<AccessBoundary to='CHANGE_TOUR' isDefaultFallback>
		<TourCreateContainer mode='update' />
	</AccessBoundary>
);

export default TourUpdate;
