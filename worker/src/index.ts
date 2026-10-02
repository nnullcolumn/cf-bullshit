export default {
	async fetch(request): Promise<Response> {
		const ORIGIN_MAP = {
			'google.bit32.band': 'www.google.com',
		};

		const url = new URL(request.url);

		if (url.hostname in ORIGIN_MAP) {
			const target = ORIGIN_MAP[url.hostname];
			url.hostname = target;
			return fetch(url.toString(), request);
		}
		return fetch(request);
	},
} satisfies ExportedHandler;
