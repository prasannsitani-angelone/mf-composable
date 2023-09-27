export interface ChatData {
	chat: ChatItem[];
}

export interface ChatItem {
	isDefault: boolean;
	isRoot: boolean;
	isFinal: boolean;
	latest?: boolean;
	owner: 'angel' | 'user'; // to decide the side where the message to be shown and its styling
	type: 'message' | 'choices' | 'schemes' | 'nudges'; // user can have only message type, angel can have all 4
	texts: TextTypes[];
	question?: string;
	id?: string;
	nextId?: string;
	parentId?: string;
	data: {
		choices?: ChoiceItem[];
		schemes?: PromptSchemeDetails[];
		nudges?: EvaluateNudgeData[];
	};
}

export interface ChoiceItem {
	description?: string;
	id: string;
	label: string;
	isRoot?: boolean;
	choiceId?: string;
	nextId?: string;
	mostChosen?: boolean;
}

export interface TextTypes {
	type: string;
	displayText: string;
}

export interface PromptResData {
	parentId: string;
	prompt: PromptType;
	nextId: string;
}

export interface PromptType {
	texts: string[];
	id: string;
	question: string;
	type: string;
	data: ChoiceItem[];
}

export interface PromptContext {
	context: ContextItem[];
	rootPromptId: string;
}

export interface ContextItem {
	choiceId: string;
	choiceValue: string;
	id: string;
	order: number;
}

export interface PromptEvaluateData {
	type: string;
	id: string;
	texts: string[];
	data: EvaluateSchemeData | EvaluateNudgeData;
}

export interface EvaluateSchemeData {
	packId: string;
	description: string;
	schemes: PromptSchemeDetails[];
}

export interface EvaluateNudgeData {
	type: string;
	heading: string;
	description: string;
	linkHeading: string;
	nudgesType: string;
	data: {
		returnPercentage: number;
	};
	id: string;
	amount: number;
}

export interface PromptSchemeDetails {
	isin: string;
	schemeCode: string;
	schemeName: string;
	logoUrl: string;
	weightage: number;
	subCategory: string;
	sipMaxInstallmentNo: number;
	sipMaxAmount: number;
	sipFrequency: string;
	minSipAmount: number;
	returns3yr: number;
	noOfClientInvested: number;
}
