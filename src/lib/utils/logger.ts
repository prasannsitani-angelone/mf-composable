import BaseLogger from './baseLogger';
import type { Config } from '$lib/types/IBaseLogger';

class Logger extends BaseLogger {
	constructor() {
		super({
			getLogsBody: Logger.getLogsBody,
			getLog: Logger.getLog
		});
	}

	init(config: Config) {
		this._init(config);
	}

	static getLogsBody = (logs = []) => {
		return logs;
	};

	static getLog = (msgObj = {}, logLevel: string | undefined) => {
		return {
			...msgObj,
			timeStamp: Date.now(),
			level: logLevel
		};
	};
}

export default new Logger();
