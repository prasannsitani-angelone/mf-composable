interface ClevertapBody {
	topic: string;
	subtext: string;
	ctatext: string;
}

export interface ClevertapEvent {
	kv: ClevertapBody;
}
