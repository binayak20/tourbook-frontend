/* eslint-disable @typescript-eslint/no-explicit-any */
export class Common {
	private url = '';
	private searchParams = new URLSearchParams();
	constructor(private itemsPerPage: number) {}

	protected setURL(url: string) {
		this.url = url;
		return this;
	}

	private getOffset(page: number, perPage: number) {
		return (page - 1) * perPage;
	}

	protected paginate(page = 1, perPage = this.itemsPerPage) {
		const offset = this.getOffset(page, perPage);
		this.searchParams = new URLSearchParams();

		if (offset === 0) {
			this.searchParams.set('limit', perPage.toString());
		}

		if (offset > 0) {
			this.searchParams.set('offset', offset.toString());
			this.searchParams.set('limit', perPage.toString());
		}

		return this;
	}

	protected params<T extends Record<string, any>>(params: T) {
		this.searchParams = new URLSearchParams();

		const page = params.page || 1;
		const perPage = params.perPage as number;
		this.paginate(page, perPage);

		Object.keys(params).forEach((key) => {
			const value = params[key] as any;

			if (!['page', 'perPage'].includes(key) && value) {
				if (Array.isArray(value)) {
					value.forEach((item) => this.searchParams.append(key, item.toString()));
				} else if (typeof value === 'object') {
					Object.keys(value).forEach((item) => this.searchParams.append(key, item.toString()));
				} else {
					this.searchParams.append(key, value.toString());
				}
			}
		});

		return this;
	}

	protected getURL() {
		const paramsString = this.searchParams.toString();
		return this.url + (paramsString ? `?${paramsString}` : '');
	}
}
