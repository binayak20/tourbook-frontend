import { Switch } from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { appActions } from '@/store/actions';
import { Space, Typography } from 'antd';

export const BetaSwitch = () => {
	const { user } = useStoreSelector((state) => state.auth);
	const { isBetaMode } = useStoreSelector((state) => state.app);
	const dispatch = useStoreDispatch();

	const isStrativUser = user?.email?.includes('@strativ.se');

	if (!isStrativUser) return null;

	return (
		<Space>
			<Typography.Text type='secondary'>Beta features</Typography.Text>
			<Switch
				checkedChildren='On'
				unCheckedChildren='Off'
				checked={isBetaMode}
				onChange={(checked) => dispatch(appActions.updateBetaMode(checked))}
			/>
		</Space>
	);
};
