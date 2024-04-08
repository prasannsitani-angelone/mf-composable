import { PUBLIC_CT_ID, PUBLIC_CT_LOG_LEVEL } from '$env/static/public';
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
		this.clevertap.init(PUBLIC_CT_ID, 'in1');
		this.clevertap.setLogLevel(PUBLIC_CT_LOG_LEVEL);

		this.loaded = true;
	}

	setProfile(profile: UserProfile) {
		this.clevertap.onUserLogin.push({
			Site: {
				Name: profile?.clientDetails?.fullName,
				Identity: profile?.clientId,
				Email: profile?.clientDetails?.email?.toLowerCase(),
				Phone: `${profile?.countryCode}${profile?.mobile}`,
				Gender: profile?.clientDetails?.gender,
				'MSG-push': true,
				'MSG-sms': true,
				'MSG-whatsapp': true,
				'MSG-email': true
			}
		});

		this.resolve(this.clevertap);
	}

	renderNotificationViewed(data) {
		this.clevertap.renderNotificationViewed(data);
	}

	renderNotificationClicked(data) {
		this.clevertap.renderNotificationClicked(data);
	}
}

export default new Clevertap();
