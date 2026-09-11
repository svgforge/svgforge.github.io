const CACHE_NAME = "github-release";
const TTL = 24 * 60 * 60 * 1000; // 24h
const cache = new Map();
const inflight = new Map();

function isFresh(entry) {
	return Boolean(entry) && Date.now() - entry.cachedAt < TTL;
}

async function getPersisted(url) {
	try {
		const store = await caches.open(CACHE_NAME);
		const response = await store.match(url);
		if (!response) return null;
		return await response.json();
	} catch {
		return null;
	}
}

async function putPersisted(url, entry) {
	try {
		const store = await caches.open(CACHE_NAME);
		await store.put(
			url,
			new Response(JSON.stringify(entry), {
				headers: { "content-type": "application/json" },
			}),
		);
	} catch {
		// ignore storage failures and fall back to in-memory cache
	}
}

function remember(url, data) {
	const entry = { data, cachedAt: Date.now() };
	cache.set(url, entry);
	putPersisted(url, entry);
	return entry;
}

async function load(url) {
	let response = await fetch(url);
	if (
		response.status === 404 &&
		!url.includes("?") &&
		url.endsWith("/latest")
	) {
		response = await fetch(url.replace(/\/latest$/, "/releases?per_page=1"));
	}
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	const data = await response.json();
	const item = Array.isArray(data) ? data[0] : data;
	if (!item?.tag_name) throw new Error("no release found");
	return {
		tagName: item.tag_name,
		htmlUrl: item.html_url,
		publishedAt: item.published_at || null,
	};
}

function reply(port, url, payload) {
	port.postMessage(Object.assign({ url }, payload));
}

function refresh(url) {
	const request = load(url)
		.then((data) => {
			remember(url, data);
			return data;
		})
		.catch(() => {
			// keep the stale copy when the network fails (e.g. rate limit)
		});
	inflight.set(url, request);
	request.finally(() => inflight.delete(url));
}

self.onconnect = (event) => {
	const port = event.ports[0];
	port.onmessage = (message) => {
		const url = String(message.data?.url || "");
		if (!url) return;

		const mem = cache.get(url);
		if (isFresh(mem)) return reply(port, url, { data: mem.data });

		if (inflight.has(url)) {
			const pending = inflight.get(url);
			pending.then(
				(data) => reply(port, url, { data }),
				(err) => reply(port, url, { error: String(err) }),
			);
			return;
		}

		getPersisted(url).then((persisted) => {
			if (persisted?.data) {
				cache.set(url, persisted);
				if (isFresh(persisted)) {
					reply(port, url, { data: persisted.data });
					return;
				}
				// stale: serve immediately, revalidate in the background
				reply(port, url, { data: persisted.data });
				refresh(url);
				return;
			}

			const request = load(url)
				.then((data) => {
					remember(url, data);
					return data;
				})
				.catch((err) => {
					throw err;
				});
			inflight.set(url, request);
			request
				.then(
					(data) => reply(port, url, { data }),
					(err) => reply(port, url, { error: String(err) }),
				)
				.finally(() => inflight.delete(url));
		});
	};
};
