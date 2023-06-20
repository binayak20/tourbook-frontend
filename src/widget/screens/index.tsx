import { useWidgetState } from '../libs/WidgetContext';
import Booking from './Booking';
import SearchBar from './SearchBar';
import TourList from './TourList';

const Screens = () => {
	const { state } = useWidgetState();
	return (
		<>
			{state?.widget_screen !== 'booking' ? <SearchBar /> : null}
			{state?.widget_screen === 'list' ? <TourList /> : null}
			{state?.widget_screen === 'booking' ? <Booking /> : null}
		</>
	);
};

export default Screens;
