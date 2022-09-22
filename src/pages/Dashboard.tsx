import { PRIVATE_ROUTES } from '@/routes/paths';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const Dashboard: FC = () => (
	// <AccessBoundary to='DASHBOARD' isDefaultFallback>
	<div>
		<h1>Dashboard</h1>
		<Link to={PRIVATE_ROUTES.PROFILE}>Go to Profile</Link>
		<br />
	</div>
);

export default Dashboard;
