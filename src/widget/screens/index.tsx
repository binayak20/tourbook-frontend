import { useWidgetState } from '../libs/WidgetContext';
import Booking from './Booking';
import SearchBar from './SearchBar';
import Success from './Success';
import TourList from './TourList';

const Screens = () => {
	const { state } = useWidgetState();
	return (
		<>
			{state?.widget_screen !== 'booking' && state?.widget_screen !== 'success' ? (
				<SearchBar />
			) : null}
			{state?.widget_screen === 'list' ? <TourList /> : null}
			{state?.widget_screen === 'booking' ? <Booking /> : null}
			{state?.widget_screen === 'success' ? <Success /> : null}
		</>
	);
};

export default Screens;
