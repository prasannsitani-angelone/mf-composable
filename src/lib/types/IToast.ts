type CallbackFunction = (a: ToastItem) => void;
export interface ToastItem {
	type: 'SUCCESS' | 'ERROR' | 'STATUS';
	message: string;
	redirectText?: string;
	redirectLink?: string;
	callback?: CallbackFunction;
	class?: string;
}
