import BaseLogger from './baseLogger';
import type { Config } from '$lib/types/IBaseLogger';
import { browser } from '$app/environment';
import memoryManagement from './memoryManagement';

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
			memoryUsage: browser ? memoryManagement.getRelativeMemoryUsage() : 'SERVER',
			memoryMetrics: browser
				? memoryManagement.checkIfCrossedRelativeMemory()
					? memoryManagement.getMemoryMetrics()
					: null
				: 'SERVER',
			log_type: 'application',
			...msgObj,
			timeStamp: Date.now(),
			level: logLevel
		};
	};
}

export default new Logger();
