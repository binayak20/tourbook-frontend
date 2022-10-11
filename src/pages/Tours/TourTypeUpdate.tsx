import { TourTypeCreateContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TourTypeUpdate = () => (
	<AccessBoundary to='CHANGE_TOURTYPE' isDefaultFallback>
		<TourTypeCreateContainer mode='update' />
	</AccessBoundary>
);

export default TourTypeUpdate;
