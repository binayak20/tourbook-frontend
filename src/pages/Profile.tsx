import { routeNavigate } from '@/routes/utils';
import { FC } from 'react';
import { Link } from 'react-router-dom';

const Profile: FC = () => (
	// <AccessBoundary to='PROFILE' isDefaultFallback>
	<div>
		<h1>Profile</h1>
		<Link to={routeNavigate('DASHBOARD')}>Go to Dashboard</Link>
	</div>
);

export default Profile;
