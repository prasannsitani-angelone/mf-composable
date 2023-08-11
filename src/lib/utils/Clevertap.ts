import type { UserProfile } from '$lib/types/IUserProfile';

function promiseWrapper() {
	let resolve;
	const promise = new Promise((res) => {
		resolve = res;
	});

	return { promise, resolve };
}

class Clevertap {
	constructor() {
		const { promise, resolve } = promiseWrapper();
		this.clevertap = {};
		this.loaded = false;
		this.initialized = promise;
		this.resolve = resolve;
	}

	async init() {
		this.clevertap = (await import('clevertap-web-sdk')).default;
		this.clevertap.privacy.push({ optOut: false });
		this.clevertap.privacy.push({ useIP: false });
		this.clevertap.init('TEST-W8R-Z44-K76Z', 'in1');
		this.clevertap.setLogLevel(3);

		this.loaded = true;
	}

	setProfile(profile: UserProfile) {
		this.clevertap.profile.push({
			Site: {
				Name: profile?.clientDetails?.fullName,
				Identity: profile?.clientId,
				Email: profile?.clientDetails?.email,
				Phone: `${profile?.countryCode}${profile?.mobile}`,
				Gender: profile?.clientDetails?.gender,
				'MSG-push': true,
				'MSG-sms': true,
				'MSG-whatsapp': true
			}
		});

		this.resolve(this.clevertap);
	}
}

export default new Clevertap();
