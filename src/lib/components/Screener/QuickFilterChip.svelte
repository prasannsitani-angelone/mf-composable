<script lang="ts">
	import { onMount, tick } from 'svelte';

	let selected = true;
	let id: string;
	let enableScroll = false;
	const setScrollPosition = () => {
		const currentLink = document.getElementById(id);
		currentLink?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
	};
	onMount(async () => {
		await tick();
		if (selected && enableScroll) {
			if (typeof window.requestIdleCallback === 'function') {
				requestIdleCallback(() => {
					setScrollPosition();
				});
			} else {
				setTimeout(() => {
					setScrollPosition();
				}, 66);
			}
		}
	});
	export { selected, id, enableScroll };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class={`w-fit cursor-pointer whitespace-nowrap rounded-full border  bg-background-alt px-3 py-1 ${
		selected ? 'border-primary' : 'border-disabled'
	}`}
	on:click
	{id}
>
	<div class={`text-sm  ${selected ? 'text-primary' : 'text-body'}`}>
		<slot />
	</div>
</div>
