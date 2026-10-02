function subpath_regex(name: string) {
	return new RegExp(`^/${name}(?:/|$)`);
}

function strip(pathname: string, regex: RegExp) {
	return pathname.replace(regex, '');
}

export default {
	async fetch(request): Promise<Response> {
		const url: Readonly<URL> = new URL(request.url);
		const hostname = url.hostname,
			pathname = url.pathname;

		const gh_path = subpath_regex(`gh`);
		const portainer_path = subpath_regex(`portainer`);

		let target = new URL(url);

		function redirect() {
			return Response.redirect(target.toString());
		}

		function passthrough() {
			// TODO: get a real fucking server
			if (target.hostname.match(/(?=\.|^)bit32\.band$/)) {
				target.hostname = `placeholder.org`;
				target.pathname = ``;

				return redirect();
			}

			return fetch(target, request);
		}

		if (hostname == `kage.bit32.band`) {
			if (gh_path.test(pathname)) {
				target.hostname = `github.com`;
				target.pathname = `/kagescripts/${strip(pathname, gh_path)}`;

				return redirect();
			}

			target.hostname = `kagescripts.online`;

			if (portainer_path.test(pathname)) {
				target.port = `9443`;
				target.pathname = `/${strip(pathname, portainer_path)}`;
			}

			return passthrough();
		} else {
			return passthrough();
		}
	},
} satisfies ExportedHandler;
