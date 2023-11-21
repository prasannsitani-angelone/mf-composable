interface ClevertapBody {
	topic: string;
	subtext: string;
	ctatext: string;
	title: string;
	ctaurl: string;
	secondarytext: string;
}

export interface ClevertapEvent {
	kv: ClevertapBody;
}
