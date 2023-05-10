<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$components/Button.svelte';

	export let value = '';
	export let errorMsg = '';
	export let onResendClick = () => '';

	type Item = {
		value?: string;
		self?: HTMLInputElement;
	};

	let otp: Item[] = [
		{ value: '', self: undefined },
		{ value: '', self: undefined },
		{ value: '', self: undefined },
		{ value: '', self: undefined },
		{ value: '', self: undefined },
		{ value: '', self: undefined }
	];

	const onlyNumbers = new RegExp(/^[0-9]*$/);

	/**
	 * @param {{value: string;self: {};}} item
	 * @param {number} index
	 * @param {KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement; }} e
	 */
	function inputChange(e: KeyboardEvent, item: Item, index: number) {
		otp[index].value = item.value || String(item.value) === '0' ? String(item.value).charAt(0) : '';
		if (index < otp.length - 1 && (item.value || item.value === '0')) {
			otp[index + 1].self?.focus();
		}

		if (e.key == 'Backspace') {
			otp[index].value = '';
			if (index !== 0) {
				otp[index - 1].self?.focus();
			}
		}

		value = otp.reduce((acc, curr) => acc + String(curr.value), '');
	}

	const clearExistingOtpParams = () => {
		otp = otp.map((entity) => {
			entity.value = '';
			return entity;
		});
	};

	const resendButtonClicked = () => {
		onResendClick();
		clearExistingOtpParams();
	};

	const onPaste = (e: ClipboardEvent) => {
		e.preventDefault();
		let pastedValue = (e.clipboardData || window.clipboardData).getData('text');

		const isValidCopyPaste = pastedValue && onlyNumbers.test(pastedValue) && pastedValue.length > 0;

		if (isValidCopyPaste) {
			const targetStr = pastedValue.substring(0, 6);
			otp.forEach((val, i) => {
				otp[i].value = targetStr.charAt(i) || '';
			});
			otp[targetStr.length - 1].self?.focus();
		}
	};

	onMount(() => {
		otp[0].self?.focus();
	});
</script>

<div class={`otp-box flex w-full justify-between ${$$props.class}`}>
	<div class="w-[50%] text-left text-sm text-grey-body">Enter OTP</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<Button
		class="resend-otp cursor-pointer"
		variant="transparent"
		size="xs"
		onClick={resendButtonClicked}>RESEND OTP</Button
	>
	<div class="otp-input-container">
		{#each otp as ot, i}
			<input
				type="number"
				name="flavours"
				bind:value={ot.value}
				min="0"
				max="9"
				class="otp-inputs text-2xl"
				bind:this={ot.self}
				on:keyup={(e) => inputChange(e, ot, i)}
				on:paste={(e) => onPaste(e, ot, i)}
			/>
		{/each}
	</div>
	{#if errorMsg}
		<div class="mt-1 text-xs text-red-sell">{errorMsg}</div>
	{/if}
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.text-secondary {
		font-style: normal;
		font-weight: 400;
		font-size: 0.875rem;
		line-height: 1.125rem;
		color: #6a7582;
	}
	.otp-box {
		display: flex;
		flex-wrap: wrap;
		/* max-width: 22rem; */
	}
	.otp-text {
		width: 50%;
		text-align: left;
	}
	.resend-otp {
		width: 50%;
		font-style: normal;
		font-weight: 600;
		font-size: 0.875rem;
		line-height: 1rem;
		text-align: right;
		text-transform: uppercase;
		color: #3f5bd9;
	}
	.otp-input-container {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: 0.5rem;
	}
	.otp-inputs {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 0.75rem;
		width: 15%;
		height: 3.25rem;
		background: #f8f9fc;
		border-radius: 0.25rem;
		border: none;
		text-align: center;
	}
</style>
