import { browser } from '$app/environment';

class SessionStorage {
	setItem(key: string, value: string) {
		if (browser) {
			sessionStorage.setItem(key, value);
		}
	}

	getItem(key: string) {
		if (browser) {
			return sessionStorage.getItem(key);
		}
		return null;
	}

	setObject(key: string, value: object) {
		try {
			this.setItem(key, JSON.stringify(value));
		} catch (err) {
			return;
		}
	}

	getObject(key: string) {
		try {
			const obj = JSON.parse(this.getItem(key));
			return obj || {};
		} catch (err) {
			return {};
		}
	}
}

export default new SessionStorage();
