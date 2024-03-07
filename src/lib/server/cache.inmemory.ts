// import LRU from 'lru-cache';
import { caching } from 'cache-manager';
import { hash } from 'ohash';

const DefaultCacheOption = {
	max: 500,
	ttl: 10000
};
interface CacheOptions {
	max: number;
	ttl: number;
}
class InMemoryCache {
	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	cached: any;

	constructor() {
		this.cached = {};
	}

	async get(key: string | object) {
		const result = await this.cached.get(hash(key));
		return result;
	}

	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	async set(key: string | object, value: any) {
		await this.cached.set(hash(key), value);
	}

	async init(options: CacheOptions) {
		let cachingOption: CacheOptions = DefaultCacheOption;
		if (options !== null && typeof options === 'object') {
			cachingOption = { ...cachingOption, ...options };
		}
		this.cached = await caching('memory', cachingOption);
	}
}

export default new InMemoryCache();
