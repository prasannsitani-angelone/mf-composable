/* eslint-disable */
export interface LogMsgObj {
	log_type?: string;
	type: string;
	params?: any;
}

export interface AnalyticMsgObj {
	screen_name: string;
	event_type: string;
	event_sub_type: string;
	event_name: string | null;
	event_property: string | null;
	event_id: string;
	event_metadata?: any;
}

export interface Config {
	logs?: Record<string, any>;
	batchSize?: number;
	logLevel?: string;
	isDev?: boolean;
	enabled?: boolean;
	baseUrl?: string;
	url?: string;
	headers?: Record<string, any>;
	getLogsBody?: (params: any) => any;
	getLog?: (msgObj: any, logLevel?: string) => Record<string, any>;
	initialised?: boolean;
	consoleOnServer?: boolean;
}

export interface State {
	logs: Record<string, any>;
	batchSize: number;
	logLevel: string;
	isDev: boolean;
	enabled: boolean;
	baseUrl: string;
	url: string;
	headers: Record<string, any>;
	getLogsBody: (params: Record<string, any>) => any;
	getLog: (msgObj: AnalyticMsgObj | LogMsgObj, logLevel?: string) => Record<string, any>;
	initialised: boolean;
	consoleOnServer: boolean;
}
