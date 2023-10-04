<script lang="ts">
	import { BUTTON_STYLE } from '$lib/constants/button';
	import type { SvelteComponent } from 'svelte';
	let variant: 'contained' | 'outlined' | 'transparent' = 'contained';
	let color: 'primary' | 'secondary' | 'success' = 'primary';
	let style = '';
	let clazz = '';
	let sizeClass: string;
	let size: 'lg' | 'md' | 'sm' | 'xs' = 'md';
	let disabled = false;
	let ariaLabel = '';
	let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> | null = null;
	let startAdornment: typeof SvelteComponent | null = null;
	let endAdornment: typeof SvelteComponent | null = null;
	if (size === 'lg') {
		sizeClass = 'btn-lg';
	} else if (size === 'xs') {
		sizeClass = 'btn-xs';
	} else if (size === 'sm') {
		sizeClass = 'btn-sm';
	} else {
		sizeClass = 'btn-md';
	}
	export {
		clazz as class,
		variant,
		color,
		style,
		startAdornment,
		endAdornment,
		disabled,
		onClick,
		type,
		size,
		ariaLabel
	};
</script>

<button
	{type}
	class={`btn border-0 text-sm font-medium capitalize disabled:bg-grey-line ${BUTTON_STYLE?.get(
		variant
	)?.get(color)} ${clazz} ${sizeClass} rounded`}
	{style}
	aria-label={ariaLabel}
	{disabled}
	on:click={onClick}
>
	{#if startAdornment}
		<span class="float-left mr-2 mt-1">
			<svelte:component this={startAdornment} />
		</span>
	{/if}
	<slot />
	{#if endAdornment}
		<span class="float-right ml-2 mt-1">
			<svelte:component this={endAdornment} />
		</span>
	{/if}
</button>
