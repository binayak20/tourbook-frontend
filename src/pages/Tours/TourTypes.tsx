import { TourTypesContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const TourTypes = () => (
	<AccessBoundary to='VIEW_TOURTYPE' isDefaultFallback>
		<TourTypesContainer />
	</AccessBoundary>
);

export default TourTypes;
