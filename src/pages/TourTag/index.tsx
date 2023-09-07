import { TourTagsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Tours = () => (
	<AccessBoundary to='VIEW_TOUR' isDefaultFallback>
		<TourTagsContainer />
	</AccessBoundary>
);

export default Tours;
