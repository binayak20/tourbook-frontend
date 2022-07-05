import { AuthService } from '@/libs/auth';
import { store } from '@/store';
import { app } from '@/store/actions';
import { HttpService } from './http.service';

export class HttpAuthService extends HttpService {
	constructor(baseURL: string, private auth: AuthService) {
		super(baseURL, {
			getToken: () => this.auth.getToken(),
			// getRefreshToken: () => this.auth.getRefreshToken(),
			// onUpdateToken: (token: string) => this.auth.setToken(token),
			onUnauthorised: () => this.auth.removeTokens(),
			onLoading: (e) => store.dispatch(app.updateRoute(e)),
		});
	}
}
