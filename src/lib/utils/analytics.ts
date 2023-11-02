import BaseLogger from './baseLogger';
import { format } from 'date-fns';
import { tokenStore } from '$lib/stores/TokenStore';
import { profileStore } from '$lib/stores/ProfileStore';
import { appStore } from '$lib/stores/SparkStore';
import { deviceStore } from '$lib/stores/DeviceStore';
import { PUBLIC_ANALYTICS_TOPIC, PUBLIC_ENV_NAME } from '$env/static/public';
import { urlStore } from '$lib/stores/UrlStore';

class Analytics extends BaseLogger {
	constructor() {
		super({
			getLog: Analytics.getLog,
			getLogsBody: Analytics.getLogsBody
		});
	}

	async init(config = {}) {
		this._init(config);
	}

	static getLogsBody = (logs = []) => {
		const date = new Date();
		return {
			api_dt: date.toISOString().split('T')[0],
			api_hr: date.getHours(),
			api_min: date.getMinutes(),
			api_timestamp: date.getTime(),
			api_timestamp_unix: format(date, 'yyyy-MM-dd hh:mm:ss.SSS'),
			app_id: appStore.deviceid(),
			app_version_id: 'mf',
			build_release: PUBLIC_ENV_NAME,
			client_id: profileStore?.clientId() || 'guest',
			client_ip: '',
			device_manufacturer: deviceStore.vendor(),
			device_model: deviceStore.model(),
			device_token: '',
			os_version: deviceStore.osVersion(),
			pipe_topic: PUBLIC_ANALYTICS_TOPIC,
			platform: appStore.platform(),
			session_id: {
				sparksessionid: tokenStore.sparkSessionID(),
				mfsessionid: tokenStore.mfSessionID()
			},
			release_code: 'analytics2.0',
			user_id: '',
			source_metadata: {
				platformVariant: appStore.platformvariant(),
				platformVersion: appStore.platformversion()
			},
			urlSource: urlStore?.urlSource(),
			eventList: logs
		};
	};

	static getLog = (log = {}) => {
		const date = new Date();
		const utcDate = Date.UTC(
			date.getUTCFullYear(),
			date.getUTCMonth(),
			date.getUTCDate(),
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds(),
			date.getUTCMilliseconds()
		);
		return {
			...log,
			client_timestamp: format(date, 'yyyy-MM-dd kk:mm:ss.SSS'),
			client_timestamp_unix: date.getTime(),
			client_timestamp_utc: format(utcDate, 'yyyy-MM-dd kk:mm:ss.SSS'),
			client_timestamp_utc_unix: utcDate
		};
	};
}

export default new Analytics();
