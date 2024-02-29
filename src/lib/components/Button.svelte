<script lang="ts">
	import { Button } from 'svelte-components';

	let sizeClass: string;
	let size: 'lg' | 'md' | 'sm' | 'xs' = 'md';
	if (size === 'lg') {
		sizeClass = 'btn-lg';
	} else if (size === 'xs') {
		sizeClass = 'btn-xs';
	} else if (size === 'sm') {
		sizeClass = 'btn-sm';
	} else {
		sizeClass = 'btn-md';
	}
	export { size };
</script>

<Button {...$$props} class="{$$props.class} {sizeClass} !font-medium" on:click>
	<svelte:fragment>
		<slot />
	</svelte:fragment>
</Button>
