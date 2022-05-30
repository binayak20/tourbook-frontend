import { routeNavigate } from '@/routes/utils';
import { Navigate } from 'react-router-dom';

const Settings = () => <Navigate to={routeNavigate('SETTINGS_PROFILE')} />;

export default Settings;
