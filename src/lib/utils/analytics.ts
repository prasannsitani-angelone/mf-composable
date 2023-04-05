import BaseLogger from './baseLogger';
import { format } from 'date-fns';

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
			api_timestamp_unix: format(date, 'yyyy-mm-dd hh:mm:ss.SSS'),
			//   app_id: sparkStore.deviceID,
			app_version_id: 'mf',
			//   build_release: runtimeConfig.name,
			//   client_id: profileStore.profileData.data?.data?.clientId || 'guest',
			client_ip: '',
			//   device_manufacturer: deviceStore.platform,
			//   device_model: getBrowserName(),
			device_token: '',
			//   os_version: deviceStore.userAgent,
			//   pipe_topic: runtimeConfig.AnalyticsTopic,
			//   platform: sparkStore.platform,
			//   session_id: tokenStore.sessionID,
			release_code: 'analytics2.0',
			user_id: '',
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
			client_timestamp: format(date, 'yyyy-mm-dd hh:mm:ss.SSS'),
			client_timestamp_unix: date.getTime(),
			client_timestamp_utc: format(utcDate, 'yyyy-mm-dd hh:mm:ss.SSS'),
			client_timestamp_utc_unix: utcDate
		};
	};
}

export default new Analytics();
