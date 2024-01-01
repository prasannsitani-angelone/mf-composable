<script lang="ts">
	import Button from './Button.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { SvelteComponent } from 'svelte';
	let Icon: typeof SvelteComponent | null = null;
	type HandleCTAClickFunction = () => string | Promise<void>;
	let handleCTAClick: HandleCTAClickFunction = () => '';
	let textForButton = '';
	let heading = '';
	let contentLine = '';

	const dispatch = createEventDispatcher();
	const onButtonClick = () => {
		if (typeof handleCTAClick === 'function') {
			handleCTAClick();
		}
		dispatch('errorCTAClicked');
	};
	export { Icon, handleCTAClick, textForButton, heading, contentLine };
</script>

<section
	class="cardHeight mt-2 flex flex-col items-center justify-center rounded-lg bg-white px-8 shadow-csm {$$props?.class}"
>
	<slot name="icon">
		<svelte:component this={Icon} />
	</slot>

	<slot name="heading">
		<div class="mt-4 text-center text-lg font-normal text-black-title">
			{heading}
		</div>
	</slot>

	<slot name="content">
		<div class="mb-4 mt-2 text-center text-sm font-normal text-grey-body">
			{contentLine}
		</div>
	</slot>

	<slot name="button">
		<Button class="mt-5 w-52 " onClick={onButtonClick} variant="outlined">
			{textForButton}
		</Button>
	</slot>
</section>

<style>
	.cardHeight {
		height: calc(100vh - 180px);
	}
</style>
