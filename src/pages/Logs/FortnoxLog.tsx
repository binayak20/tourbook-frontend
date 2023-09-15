import { FortnoxLogsContainer } from '@/containers';
import { AccessBoundary } from 'react-access-boundary';

const FortnoxLogs = () => (
	<AccessBoundary to='VIEW_EMAILLOG' isDefaultFallback>
		<FortnoxLogsContainer />
	</AccessBoundary>
);

export default FortnoxLogs;
