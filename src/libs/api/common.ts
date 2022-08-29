export class Common {
	constructor(private itemsPerPage: number) {}

	private getPageOffset(page: number, perPage?: number) {
		return (page - 1) * (perPage || this.itemsPerPage);
	}

	protected getPaginateURL(page: number, url: string, perPage?: number) {
		const offset = this.getPageOffset(page, perPage);
		const params = new URLSearchParams();

		if (offset === 0) {
			params.append('limit', perPage?.toString() || this.itemsPerPage.toString());
			return `${url}?${params.toString()}`;
		}

		if (offset > 0) {
			params.append('offset', offset.toString());
			params.append('limit', perPage?.toString() || this.itemsPerPage.toString());
			return `${url}?${params.toString()}`;
		}

		return url;
	}
}
