export interface LogMsgObj {
	type: string;
	params?: any;
}

export interface AnalyticMsgObj {
	screen_name: string;
	event_type: string;
	event_sub_type: string;
	event_name: string;
	event_property: string | null;
	event_id: string;
	event_metadata: any;
}

export interface Config {
	logs?: Record<string, any>;
	batchSize?: number;
	logLevel?: string;
	isDev?: boolean;
	enabled?: boolean;
	baseUrl?: string;
	url?: string;
	getHeaders?: () => Record<string, any>;
	getLogsBody?: (params: any) => any;
	getLog?: (msgObj: any, logLevel?: string) => Record<string, any>;
	initialised?: boolean;
}

export interface State {
	logs: Record<string, any>;
	batchSize: number;
	logLevel: string;
	isDev: boolean;
	enabled: boolean;
	baseUrl: string;
	url: string;
	getHeaders: () => Record<string, any>;
	getLogsBody: (params: Record<string, any>) => any;
	getLog: (msgObj: AnalyticMsgObj | LogMsgObj, logLevel?: string) => Record<string, any>;
	initialised: boolean;
}
