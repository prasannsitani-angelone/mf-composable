<script>
	let selected = true;

	export { selected };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class={`w-fit cursor-pointer whitespace-nowrap rounded-full border  bg-white px-3 py-1 ${
		selected ? 'border-blue-primary' : 'border-grey-secondary'
	}`}
	on:click
>
	<div class={`text-sm  ${selected ? 'text-blue-primary' : 'text-black-bolder'}`}>
		<slot />
	</div>
</div>
