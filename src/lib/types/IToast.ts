type CallbackFunction = (a: ToastItem) => void;
export interface ToastItem {
	type: 'SUCCESS' | 'ERROR';
	message: string;
	redirectText?: string;
	redirectLink?: string;
	callback?: CallbackFunction;
	class?: string;
}
