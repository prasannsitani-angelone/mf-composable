import type { AnalyticMsgObj, LogMsgObj, Config, State } from '$lib/types/IBaseLogger';
import { isDevMode } from '$lib/utils/helpers/dev';

export const LOG_LEVELS_ENUM = {
	info: 'info',
	debug: 'debug',
	error: 'error'
};

class BaseLogger {
	_state: State;
	constructor(config: Config) {
		this._state = {
			logs: [],
			batchSize: 1,
			logLevel: LOG_LEVELS_ENUM.debug,
			isDev: isDevMode(),
			enabled: false,
			baseUrl: '',
			url: '',
			headers: {},
			getLogsBody: () => {
				return this._state.logs;
			},
			getLog: () => {
				return {};
			},
			initialised: false,
			...config
		};
	}

	_init(config: Config) {
		this._state = {
			...this._state,
			...config
		};
	}

	checkLogLevel(allowedLogLevelArray: string[] = []) {
		return allowedLogLevelArray.includes(this._state.logLevel);
	}

	sendLog(logs: Record<string, any>) {
		if (this._state.isDev) {
			console.log(this._state.getLogsBody(logs));
			return;
		}
		const { url, baseUrl } = this._state;
		const options = {
			body: JSON.stringify(this._state.getLogsBody(logs)),
			method: 'POST',
			headers: this._state.headers
		};
		fetch(`${baseUrl}${url}`, options);
	}

	flush() {
		const logs = this._state.logs;
		if (logs.length === 0) {
			return;
		}
		this._state.logs = [];
		this.sendLog(logs);
	}

	log(msgObj: LogMsgObj | AnalyticMsgObj, logLevel?: string, immediate = false) {
		if (!this._state.enabled) {
			return;
		}
		this._state.logs.push(this._state.getLog(msgObj, logLevel));
		if (
			this._state.initialised &&
			(immediate || this._state.logs.length >= this._state.batchSize)
		) {
			this.flush();
		}
	}

	debug(msgObj: LogMsgObj) {
		if (this.checkLogLevel([LOG_LEVELS_ENUM.debug])) {
			this.log(msgObj, LOG_LEVELS_ENUM.debug);
		}
	}

	info(msgObj: LogMsgObj) {
		if (this.checkLogLevel([LOG_LEVELS_ENUM.debug, LOG_LEVELS_ENUM.info])) {
			this.log(msgObj, LOG_LEVELS_ENUM.info);
		}
	}

	error(msgObj: LogMsgObj) {
		this.log(msgObj, LOG_LEVELS_ENUM.error, true);
	}

	logAnalyticEvent(msgObj: AnalyticMsgObj) {
		this.log(msgObj);
	}
}

export default BaseLogger;
