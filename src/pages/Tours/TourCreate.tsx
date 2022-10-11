import { TourCreateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TourCreate = () => (
	<AccessBoundary to='ADD_TOUR' isDefaultFallback>
		<TourCreateContainer />
	</AccessBoundary>
);

export default TourCreate;
