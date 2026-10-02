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
		} else if (url.hostname == `google.bit32.band`) {
			target.hostname = `www.google.com`;

			return redirect();
		} else if (hostname == `luau.bit32.band`) {
			target.hostname = `luau.org`;

			const playground_regex = subpath_regex(`playground`);
			if (playground_regex.test(pathname)) {
				target.hostname = `play.luau.org`;
				target.pathname = `/${strip(pathname, gh_path)}`;
			}

			return redirect();
		} else if (hostname == `nnull.bit32.band`) {
			target.hostname = `github.com`;
			target.pathname = `/nnullcolumn/${strip(pathname, gh_path)}`;

			return redirect();
		} else if (hostname == `bit32.band`) {
			if (gh_path.test(pathname)) {
				target.hostname = `github.com`;
				target.pathname = `/luau-ecs/${strip(pathname, gh_path)}`;

				return redirect();
			}

			return passthrough();
		} else {
			return passthrough();
		}
	},
} satisfies ExportedHandler;
