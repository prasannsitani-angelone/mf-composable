export interface ToastItem {
	type: 'SUCCESS' | 'ERROR';
	message: string;
	redirectText?: string;
	redirectLink?: string;
}
