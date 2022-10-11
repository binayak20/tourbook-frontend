import { TourTypeCreateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TourTypeCreate = () => (
	<AccessBoundary to='ADD_TOURTYPE' isDefaultFallback>
		<TourTypeCreateContainer />
	</AccessBoundary>
);

export default TourTypeCreate;
