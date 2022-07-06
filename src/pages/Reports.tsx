import { PRIVATE_ROUTES } from '@/routes/paths';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const Reports: FC = () => (
	// <AccessBoundary to='REPORTS' isDefaultFallback>
	<div>
		<h1>Reports</h1>
		<Link to={PRIVATE_ROUTES.SETTINGS_PROFILE}>Go to Profile</Link>
		<br />
	</div>
);

export default Reports;
