import { browser } from '$app/environment';
import type { AnalyticMsgObj, LogMsgObj, Config, State } from '$lib/types/IBaseLogger';
import { isDevMode } from '$lib/utils/helpers/dev';
import merge from 'lodash.merge';
import { removeAuthHeaders } from './helpers/logging';

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
			consoleOnServer: false,
			logLevel: LOG_LEVELS_ENUM.debug,
			isDev: isDevMode(),
			enabled: false,
			baseUrl: '',
			url: '',
			NBULoggerUrl: '',
			NBULoggeraccessToken: '',
			headers: {
				'content-type': 'application/json'
			},
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

	updateConfig(config: Config) {
		this._state = merge(this._state, config);
	}

	checkLogLevel(allowedLogLevelArray: string[] = []) {
		return allowedLogLevelArray.includes(this._state.logLevel);
	}

	sendApiLog(logs: Record<string, unknown>) {
		const { url, baseUrl } = this._state;
		const options = {
			body: JSON.stringify(this._state.getLogsBody(logs)),
			method: 'POST',
			headers: this._state.headers
		};
		try {
			fetch(`${baseUrl}${url}`, options);
		} catch (error) {
			const errorStr = error?.stack?.toString() || error?.toString();
			console.log(
				JSON.stringify({
					type: 'Failed To send logs',
					param: {
						error: errorStr
					}
				})
			);
		}
	}

	sendNBUApiLog(logs: Record<string, unknown>) {
		const { NBULoggerUrl, NBULoggeraccessToken } = this._state;
		if (NBULoggerUrl && NBULoggeraccessToken) {
			const logBody = [];
			logBody.push(this._state.getLogsBody(logs));

			const options = {
				body: JSON.stringify(logBody),
				method: 'POST',
				headers: {
					Authorization: `Bearer ${this._state.NBULoggeraccessToken}`
				}
			};
			try {
				fetch(`${NBULoggerUrl}`, options);
			} catch (error) {
				const errorStr = error?.stack?.toString() || error?.toString();
				console.log(
					JSON.stringify({
						type: 'Failed To send logs to NBU logger',
						param: {
							error: errorStr
						}
					})
				);
			}
		}
	}

	sendConsoleLog(logs: Record<string, unknown>) {
		try {
			const modifiedHeaders = removeAuthHeaders(this._state.headers);
			const body = this._state.getLogsBody(logs);
			if (Array.isArray(body)) {
				body.forEach((logItem) => {
					console.log(
						JSON.stringify({
							...modifiedHeaders,
							...logItem,
							serverTimestamp: Date.now()
						})
					);
				});
			} else if (body && typeof body === 'object') {
				console.log(
					JSON.stringify({
						...modifiedHeaders,
						...body,
						serverTimestamp: Date.now()
					})
				);
			} else {
				console.log(
					JSON.stringify({
						...modifiedHeaders,
						body,
						serverTimestamp: Date.now()
					})
				);
			}
		} catch (error) {
			const errorStr = error?.stack?.toString() || error?.toString();
			console.log(
				JSON.stringify({
					type: 'Failed To console logs',
					param: {
						error: errorStr
					}
				})
			);
		}
	}

	sendLog(logs: Record<string, unknown>) {
		if (this._state.isDev) {
			this.sendConsoleLog(logs);
		} else if (!browser && this._state.consoleOnServer) {
			this.sendConsoleLog(logs);
		} else {
			this.sendApiLog(logs);
			this.sendNBUApiLog(logs);
		}
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
