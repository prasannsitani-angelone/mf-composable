/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IInputStore } from '$lib/types/IInputStore';
import { writable } from 'svelte/store';

const intialInputStore: IInputStore = { dirty: false, valid: false, message: null };

function buildValidator(validators: any[]) {
	return function validate(value: any, dirty: boolean) {
		if (!validators || validators.length === 0) {
			return { dirty, valid: true };
		}
		const failing = validators.find((v) => v(value) !== true);
		return {
			dirty,
			valid: !failing,
			message: failing && failing(value)
		};
	};
}

export function createFieldValidator(...validators: any[]) {
	const { subscribe, set } = writable(intialInputStore);

	const validator = buildValidator(validators);
	const action = (node: HTMLInputElement, binding: any) => {
		function validate(value: any, dirty: boolean) {
			const result = validator(value, dirty);
			set(result);
		}
		validate(binding, false);

		return {
			update(value: any) {
				validate(value, true);
			}
		};
	};

	const store = {
		subscribe
	};

	return {
		store,
		action
	};
}
/* eslint-enable @typescript-eslint/no-explicit-any */
