import { LogsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const Logs = () => (
	<AccessBoundary to='VIEW_EMAILLOG' isDefaultFallback>
		<LogsContainer />
	</AccessBoundary>
);

export default Logs;
