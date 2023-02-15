<script lang="ts">
	import { BUTTON_STYLE } from '$lib/constants/button.js';
	import type { SvelteComponent } from 'svelte';
	let variant: 'contained' | 'outlined' = 'contained';
	let color: 'primary' | 'secondary' | 'greenBuy' = 'primary';
	let style = '';
	let clazz = '';
	let disabled = false;
	let type: 'button' | 'submit' | 'reset' | null | undefined = 'button';
	let onClick: svelte.JSX.MouseEventHandler<HTMLButtonElement> | null = null;
	let startAdornment: typeof SvelteComponent | null = null;
	let endAdornment: typeof SvelteComponent | null = null;
	export {
		clazz as class,
		variant,
		color,
		style,
		startAdornment,
		endAdornment,
		disabled,
		onClick,
		type
	};
</script>

<button
	{type}
	class={`${BUTTON_STYLE?.get(variant)?.get(color)} rounded py-1.5 px-4 ${clazz}`}
	{style}
	{disabled}
	on:click={onClick}
>
	{#if startAdornment}
		<span class="float-left mt-1 mr-2">
			<svelte:component this={startAdornment} />
		</span>
	{/if}
	<slot />
	{#if endAdornment}
		<span class="float-right mt-1 ml-2">
			<svelte:component this={endAdornment} />
		</span>
	{/if}
</button>
