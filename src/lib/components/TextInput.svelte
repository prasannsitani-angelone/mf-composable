<script lang="ts">
	import { useActions } from '$lib/utils/helpers/actions';
	let type = 'text';
	let isMultiline = false;
	let rows = 1;
	let cols = 1;
	let name: string;
	let value: string | number | null = null;
	let id: string | null | undefined = '';
	let label = '';
	let labelClass = '';
	let inputClass = '';
	const onInputChange = null;
	const handleChange = (e: Event) => {
		value = (e.target as HTMLInputElement).value;
	};
	let actions: any[] = [];
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
		inputClass,
		labelClass,
		ref,
		actions
	};
</script>

<label class={labelClass} for={id}>{label}</label>
{#if isMultiline}
	<textarea class={`${inputClass}`} {rows} {name} {id} {value} {cols} bind:this={ref} />
{:else}
	<input
		class={`${inputClass}`}
		{type}
		{name}
		{value}
		{id}
		bind:this={ref}
		on:input={onInputChange || handleChange}
		on:change={onInputChange || handleChange}
		use:useActions={actions}
	/>
{/if}
