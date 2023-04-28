<script lang="ts">
	import { useActions } from '$lib/utils/helpers/actions';
	import type { HTMLInputTypeAtrribute, InputModeType } from '$lib/constants/input';
	let type: HTMLInputTypeAtrribute = 'text';
	let isMultiline = false;
	let rows = 1;
	let cols = 1;
	let name: string;
	let value: string | number | null = null;
	let id: string | null | undefined = '';
	let label = '';
	let classes = {
		label: '',
		input: '',
		error: 'border-red-500',
		container: '',
		parent: ''
	};
	let autocomplete: 'on' | 'off' = 'off';
	let placeholder = '';
	let onInputChange: ((e: Event) => void) | null = null;
	const handleChange = (e: Event) => {
		value = (e.target as HTMLInputElement).value;
	};
	let inputMode: InputModeType = 'text';
	let actions: any[] = [];
	let disabled = false;
	let ref: HTMLInputElement | HTMLTextAreaElement | null = null;
	export {
		type,
		isMultiline,
		rows,
		cols,
		name,
		value,
		id,
		label,
		ref,
		onInputChange,
		actions,
		disabled,
		inputMode,
		placeholder,
		classes
	};
</script>

<div class={classes.parent}>
	{#if label}
		<label class={classes.label} for={id}>{label}</label>
	{/if}
	{#if isMultiline}
		<textarea
			class={`${classes.input}`}
			{placeholder}
			{rows}
			{name}
			{id}
			{disabled}
			{value}
			{cols}
			bind:this={ref}
		/>
	{:else}
		<div class={`flex items-center justify-start ${classes.container}`}>
			<slot name="preinput" />
			<input
				{type}
				{autocomplete}
				{placeholder}
				class={`input-bordered input input-sm w-full max-w-xs ${classes.input}`}
				{name}
				{value}
				inputmode={inputMode}
				{id}
				{disabled}
				bind:this={ref}
				on:input={onInputChange || handleChange}
				use:useActions={actions}
				on:focus
				on:blur
			/>
			<slot name="posticon" />
		</div>
		<slot name="error" />
	{/if}
</div>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
